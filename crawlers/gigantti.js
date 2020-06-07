// const jsdom = require('jsdom');
// const { JSDOM } = jsdom;
const { QueryTypes } = require('sequelize');

const Crawler = require('crawler');

const axios = require('axios').default;
const Op = require('Sequelize').Op

const DATA_PRODUCT_TYPE = 31158;
const DATA_MODEL_PHONE_TYPE = 31569;
const DATA_MANUFACTURER = 30170;
const DATA_MODEL = 30879;
const DATA_COLOR = 30290;
const DATA_MANUFACTURER_COLOR = 32036;
const DATA_MANUFACTURER_MODEL_CODE = 31416;
const DATA_MODEL_CODE = 30878;
const DATA_STORAGE = 30718;
const DATA_TV_INCHES = 31323;

const BASE_URL = 'https://www.gigantti.fi';
const utils = require('./utils');
const models = require('../models/index');
const technical_info_url = 'https://www.gigantti.fi/INTERSHOP/web/WFS/store-gigantti-Site/fi_FI/-/EUR/CC_AjaxProductTab-Get?ProductSKU=FOOBAR&TemplateName=CC_ProductSpecificationTab';

let Shop;

(async () => {
    Shop = await utils.assignStore({name: 'Gigantti'});
        if (null === Shop) {
            return false;
        }    

    var c = new Crawler({
        maxConnections : 1,
        // This will be called for each crawled page
        callback : async function (error, res, done) {
            if(error){
                console.log(error);
            }else{
                console.log("Else triggeröity");
                var $ = res.$;

                $("#ManufacturerName .filter-list li.filter a div").each(async (i, k) => {
                    await models.Brand.findOrCreate({
                        where: {
                            name: $(k).text().trim()
                        }
                    })
                });

                $('.product-image-link').each(async (i, link)=> {
                    // Await että osataan sulkea crawler ajo kun nämä kaikki on suoritettu
                    //console.log("Laitetaan tuote crawler-jonoon");
                    let sku = $(link).next('div.product-number').text();
                    let title = $(link).attr('title');
                    let categories = Array.from($("ol.breadcrumbs li").slice(1).map((i,k) => ($(k).text().trim())));
                    await c2.queue({
                        uri: technical_info_url.replace('FOOBAR', sku),
                        title: title,
                        sku: sku,
                        categories: categories,
                        image: $(link).find('.product-image:last-child').attr('src'),
                        price: parseFloat($(link).siblings('.product-price').text().replace(/\W/, ''))
                        }
                    );
                });
            }
            console.log("Nyt on kaikki done");
            done();
        }
    });

    var c2 = new Crawler({
        maxConnections : 1,
        // This will be called for each crawled page
        callback : async function (error, res, done) {
            if(error){
                console.log("Crawlausvirhe rivillä 58");
                console.log(error);
            }else{
                let $ = res.$;
                let foo = {
                    display_name: res.options.title,
                    product_type: $("td[data-md-value-id='"+DATA_PRODUCT_TYPE+"']").text(),
                    color: $("[data-md-value-id='"+DATA_COLOR+"']").text(),
                    manufacturer: $("[data-md-value-id='"+DATA_MANUFACTURER+"']").text(),
                    manufacturer_id: null,
                    manufacturer_color: $("[data-md-value-id='"+DATA_MANUFACTURER_COLOR+"']").text(),
                    model: $("[data-md-value-id='"+DATA_MODEL+"']").text(),
                    model_code: $("[data-md-value-id='"+DATA_MODEL_CODE+"']").text(),
                    storage: $("[data-md-value-id='"+DATA_STORAGE+"']").text(),
                    ean: $(".spec-table td:contains(EAN-koodi)").next('td').html(),
                    model_code_2: $("[data-md-value-id='"+DATA_MANUFACTURER_MODEL_CODE+"']").text(),
                    sku: res.options.sku,
                    categories: res.options.categories,
                    screen_inches: $("[data-md-value-id='"+DATA_TV_INCHES+"']").text()
                };

                let Brand = utils.findBrand(foo.manufacturer, foo.model);
                
                // Remove possible manufacturer from beginning of model string.
                let regExp = new RegExp(foo.manufacturer, "ig");
                let use_display_name = false;
                console.log("RegExp siivoaa nyt tuotenimestä: " + foo.model + " valmistajan:", foo.manufacturer);
                foo.model = foo.model.replace(regExp, "").trim();
                try {
                    // If product name has model_code_2 in it, remove it from it. 
                    if (foo.model_code_2 && (foo.model).includes(foo.model_code_2)) {
                        console.log("Siivotaan model_code_2 pois modelista:", foo.model);
                        let newModel = foo.model.replace(foo.model_code_2, '').trim();
                        console.log("Siivottiin model_code_2 pois, newModel on nyt: '" + newModel + "'");
                        console.log("Vertailun vuoksi, valmistaja on: '" +  foo.manufacturer + "'");
                        
                        // Model name has no model_code_2 from it. If it's empty string now, don't update it.
                        if (newModel) {
                            foo.model = newModel;
                        } else {
                            /** TODO: since product has no additional identifications except model_code_2, it seems
                            We have no reliable way to map products together. Model_code_2 seems to be
                            Variation specific code, which would result into multiple same products created over again.
                            Let's just skip these crappy results. Other crawlers can possibly create better names
                            For these products, and next run can possibly match these using EAN-codes? */
                            console.log("------ Siivosin alunperin tuotetta, en pysty ehkä tekemään tästä validia:", foo.model);
                            //throw new Error("Cannot validate product: " + foo.display_name);
                            use_display_name = true;
                        }
                    }

                    console.log("---- Parsiminen ohitse, tässä tuotetiedot ----");
                    console.log(foo);

                    let name,variation_name;
                    if (use_display_name) {
                        console.log("Parse failed, teen tuotteen, jonka nimeksi tulee: " + foo.display_name);
                        name = foo.display_name;
                        variation_name = foo.display_name;
                    } else {
                        name = foo.manufacturer.trim() + ' ' + foo.model.trim();
                        console.log("Teen tuotteen, jonka nimeksi tulee: " + name);
                        variation_name = name + ", " + foo.storage + " " + foo.color + " " + foo.model_code + " " + foo.model_code_2;
                        console.log("Variaation nimeksi voisi tulla: " + name + ", " + foo.storage + " " + foo.color + " " + foo.model_code + " " + foo.model_code_2);
                    }

                    let CategoryName = res.options.categories.pop();
                    console.log("Kategoriaksi tulee: ", CategoryName);

                    // Try to find category by category name. if no such is found, create one.
                    let [category, isCreated] = await models.Category.findOrCreate({
                        where: {
                            name: CategoryName
                        }
                    }).all()

                    // Let's try to find any variation matching this product ean code or model (if they're not empty).
                    let variation_params = {};
                    if (foo.ean) {
                        variation_params.ean = foo.ean;
                    }
                    if (foo.model_code) {
                        variation_params.model_code = foo.model_code;
                    }
                    let variation, product;
                    if (variation_params) {
                        variation = await models.Variation.findOne({
                            where: {
                                [Op.or]: variation_params
                            },
                            include: [{
                                model: models.Product
                            }]
                        });
                        if (variation instanceof models.Variation) {
                            if (! variation.product) {
                                throw new Error("Variation loaded, but it has no product, wtf?");
                            }
                            product = variation.product;
                        }
                    }

                    // No variations matched to our search. Let's try to use direct product name as second choice. If no results found, let's directly create one.
                    if (! variation) {
                        console.log("Yritettiin etsiä variaatiota, mutta ei löydetty. Etsitään tuotetta, jolle voidaan luoda uusi variaatio.");
                        let [NewProduct,product_created] = await models.Product.findOrCreate(
                            {
                                where: {
                                    model: name
                                },
                                defaults: {
                                    image: res.options.image ? BASE_URL + res.options.image : 'https://i.picsum.photos/id/400/200/300.jpg',

                                }
                            }).all();

                        if (product_created && category) {
                            console.log("Tuotetta ei löydetty, sellainen luotiin.");
                            await category.addProduct(NewProduct);
                            await Brand.addProduct(NewProduct);
                        }

                        if (! NewProduct instanceof models.Product) {
                            throw new Error("Nyt tuli joku tosi outo virhe");
                        }

                        variation = await models.Variation.create({
                            ean: foo.ean,
                            display_name: variation_name,
                            model_code: foo.model_code ? foo.model_code : null,
                            data: foo
                        });
                        await NewProduct.addVariation(variation.id);
                        product = NewProduct;
                    }

                    // If we still have no variation, we didn't find one and didn't create one. This sucks.
                    if (!variation) {
                        throw new Error("Failed to create new variation.");
                    }
                    if (!product) {
                        throw new Error("Failed to create new product.");
                    }


                    let [price,createdPrice] = await models.Price.findOrCreate({
                        where: {
                            variation_id: variation.get('id'),
                            shop_id: Shop.get('id'),
                        },
                        defaults: {
                            price: res.options.price
                        }
                    });
                    
                    if (createdPrice) {
                        console.log("Didn't find price for variation_id: " + variation.get('id') + " , shop_id: " + Shop.get('id'))
                        await variation.addPrice(price);            
                        await Shop.addPrice(price);
                    } else {
                        console.log("Found an existing price for variation, now I'm updating it");
                        // Force update updated_at timestamp even if price doesn't change.
                        price.changed('updated_at',true);
                        price.changed('price', res.options.price);
                        await price.save()
                    }
                   
                    fetchReviews(product, variation, foo.sku);

                } catch (err) {
                    console.log("Nyt tuli virhe try-lohkon sisällä");
                    console.log(err);
                    console.log(foo);
                    
                }
            }
            done();
        }  
    });

  console.log("Haetaan kaikki Applen hakusanaa vastaavat puhelimet ja laitetaan jokainen crawlauksen alle");
  await utils.findBrand('Apple', 'Apple iPhone 11 pro');
  await utils.findBrand('Samsung', 'Samsung Galaxy S10');
  await utils.findBrand('foobar', 'Foobar Fibar Fubar');
    // c.queue("https://www.gigantti.fi/catalog/tv-ja-video/fi-tv/televisiot?SearchParameter=%26%40QueryTerm%3D*%26ContextCategoryUUID%3DEq.sGQV5dncAAAFDpMM2st6C%26discontinued%3D0%26ManufacturerName%3DSony%26online%3D1%26%40Sort.ViewCount%3D1%26%40Sort.ProductListPrice%3D0&PageSize=99&ProductElementCount=&searchResultTab=Products&CategoryName=fi-tv&CategoryDomainName=store-gigantti-ProductCatalog#filter-sidebar");
    // c.queue("https://www.gigantti.fi/catalog/tv-ja-video/fi-tv/televisiot?SearchParameter=%26%40QueryTerm%3D*%26ContextCategoryUUID%3DEq.sGQV5dncAAAFDpMM2st6C%26discontinued%3D0%26ManufacturerName%3DSamsung%26online%3D1%26%40Sort.ViewCount%3D1%26%40Sort.ProductListPrice%3D0&PageSize=99&ProductElementCount=&searchResultTab=Products&CategoryName=fi-tv&CategoryDomainName=store-gigantti-ProductCatalog#filter-sidebar");
    // c.queue("https://www.gigantti.fi/catalog/tv-ja-video/fi-tv/televisiot?SearchParameter=%26%40QueryTerm%3D*%26ContextCategoryUUID%3DEq.sGQV5dncAAAFDpMM2st6C%26discontinued%3D0%26ManufacturerName%3DTCL%26online%3D1%26%40Sort.ViewCount%3D1%26%40Sort.ProductListPrice%3D0&PageSize=12&ProductElementCount=&searchResultTab=Products&CategoryName=fi-tv&CategoryDomainName=store-gigantti-ProductCatalog#filter-sidebar");
    // c.queue("https://www.gigantti.fi/catalog/tv-ja-video/fi-tv/televisiot?SearchParameter=%26%40QueryTerm%3D*%26ContextCategoryUUID%3DEq.sGQV5dncAAAFDpMM2st6C%26discontinued%3D0%26ManufacturerName%3DGrundig%26online%3D1%26%40Sort.ViewCount%3D1%26%40Sort.ProductListPrice%3D0&PageSize=12&ProductElementCount=&searchResultTab=Products&CategoryName=fi-tv&CategoryDomainName=store-gigantti-ProductCatalog#filter-sidebar");
    // c.queue("https://www.gigantti.fi/catalog/audio-ja-hifi/fi-kuulokkeita/kuulokkeet?SearchParameter=%26%40QueryTerm%3D*%26ContextCategoryUUID%3DW_GsGQV59PEAAAFDn8c2st6C%26discontinued%3D0%26Kuulokkeen%2Btyyppi%3DAround-ear%2Bkuuloke%26ManufacturerName%3DBose%26online%3D1%26%40Sort.SoldQuantity%3D1%26%40Sort.ProductListPrice%3D0&PageSize=12&ProductElementCount=&searchResultTab=Products&CategoryName=fi-kuulokkeita&CategoryDomainName=store-gigantti-ProductCatalog#filter-sidebar");
    // c.queue("https://www.gigantti.fi/catalog/audio-ja-hifi/fi-kuulokkeita/kuulokkeet?SearchParameter=%26%40QueryTerm%3D*%26ContextCategoryUUID%3DW_GsGQV59PEAAAFDn8c2st6C%26discontinued%3D0%26Kuulokkeen%2Btyyppi%3DAround-ear%2Bkuuloke%26ManufacturerName%3DBang%2B%2526%2BOlufsen%26online%3D1%26%40Sort.SoldQuantity%3D1%26%40Sort.ProductListPrice%3D0&PageSize=12&ProductElementCount=&searchResultTab=Products&CategoryName=fi-kuulokkeita&CategoryDomainName=store-gigantti-ProductCatalog#filter-sidebar");
    // c.queue("https://www.gigantti.fi/catalog/audio-ja-hifi/fi-kuulokkeita/kuulokkeet?SearchParameter=%26%40QueryTerm%3D*%26ContextCategoryUUID%3DW_GsGQV59PEAAAFDn8c2st6C%26discontinued%3D0%26Kuulokkeen%2Btyyppi%3DAround-ear%2Bkuuloke%26ManufacturerName%3DBose%26online%3D1%26%40Sort.SoldQuantity%3D1%26%40Sort.ProductListPrice%3D0&PageSize=99&ProductElementCount=&searchResultTab=Products&CategoryName=fi-kuulokkeita&CategoryDomainName=store-gigantti-ProductCatalog#filter-sidebar")
    // c.queue("https://www.gigantti.fi/catalog/puhelimet-ja-gps/fi-puhelimet/puhelimet?SearchParameter=%26%40QueryTerm%3D*%26ContextCategoryUUID%3DstmsGQV5fqMAAAFDI7k2st6C%26discontinued%3D0%26ManufacturerName%3DOnePlus_or_Honor_or_Nokia_or_Sony_or_Xiaomi%26online%3D1%26%40Sort.ViewCount%3D1%26%40Sort.ProductListPrice%3D0&PageSize=99&ProductElementCount=&searchResultTab=Products&CategoryName=fi-puhelimet&CategoryDomainName=store-gigantti-ProductCatalog#filter-sidebar");
    // c.queue("https://www.gigantti.fi/catalog/puhelimet-ja-gps/fi-puhelimet/puhelimet?SearchParameter=%26%40QueryTerm%3D*%26ContextCategoryUUID%3DstmsGQV5fqMAAAFDI7k2st6C%26discontinued%3D0%26ManufacturerName%3DHUAWEI%26online%3D1%26%40Sort.ViewCount%3D1%26%40Sort.ProductListPrice%3D0&PageSize=80&ProductElementCount=&searchResultTab=Products&CategoryName=fi-puhelimet&CategoryDomainName=store-gigantti-ProductCatalog#filter-sidebar");
    // c.queue("https://www.gigantti.fi/catalog/puhelimet-ja-gps/fi-puhelimet/puhelimet?SearchParameter=%26%40QueryTerm%3D*%26ContextCategoryUUID%3DstmsGQV5fqMAAAFDI7k2st6C%26discontinued%3D0%26Malli%3DGalaxy%2BA40%2BEnterprise%26ManufacturerName%3DSamsung%26online%3D1%26%40Sort.ViewCount%3D1%26%40Sort.ProductListPrice%3D0&PageSize=12&ProductElementCount=&searchResultTab=Products&CategoryName=fi-puhelimet&CategoryDomainName=store-gigantti-ProductCatalog#filter-sidebar");
    // c.queue("https://www.gigantti.fi/catalog/puhelimet-ja-gps/fi-puhelimet/puhelimet?SearchParameter=%26%40QueryTerm%3D*%26ContextCategoryUUID%3DstmsGQV5fqMAAAFDI7k2st6C%26discontinued%3D0%26ManufacturerName%3DSamsung%26online%3D1%26%40Sort.ViewCount%3D1%26%40Sort.ProductListPrice%3D0&PageSize=80&ProductElementCount=&searchResultTab=Products&CategoryName=fi-puhelimet&CategoryDomainName=store-gigantti-ProductCatalog#filter-sidebar");
    // c.queue("https://www.gigantti.fi/catalog/puhelimet-ja-gps/fi-puhelimet/puhelimet?SearchParameter=%26%40QueryTerm%3D*%26ContextCategoryUUID%3DstmsGQV5fqMAAAFDI7k2st6C%26discontinued%3D0%26ManufacturerName%3DApple%26online%3D1%26%40Sort.ViewCount%3D1%26%40Sort.ProductListPrice%3D0&PageSize=80&ProductElementCount=&searchResultTab=Products&CategoryName=fi-puhelimet&CategoryDomainName=store-gigantti-ProductCatalog#filter-sidebar");
    // c.queue("https://www.gigantti.fi/catalog/puhelimet-ja-gps/fi-puhelimet/puhelimet?SearchParameter=%26%40QueryTerm%3D*%26ContextCategoryUUID%3DstmsGQV5fqMAAAFDI7k2st6C%26discontinued%3D0%26Malli%3DiPhone%2B11%2BPro%2BMax_or_iPhone%2B11_or_iPhone%2B11%2BPro%26ManufacturerName%3DApple%26online%3D1%26%40Sort.ViewCount%3D1%26%40Sort.ProductListPrice%3D0&PageSize=80&ProductElementCount=&searchResultTab=Products&CategoryName=fi-puhelimet&CategoryDomainName=store-gigantti-ProductCatalog#filter-sidebar");
    // c.queue("https://www.gigantti.fi/catalog/puhelimet-ja-gps/fi-puhelimet/puhelimet?SearchParameter=%26%40QueryTerm%3D*%26ContextCategoryUUID%3DstmsGQV5fqMAAAFDI7k2st6C%26discontinued%3D0%26ManufacturerName%3DApple%26online%3D1%26%40Sort.ViewCount%3D1%26%40Sort.ProductListPrice%3D0&PageSize=80&ProductElementCount=&searchResultTab=Products&CategoryName=fi-puhelimet&CategoryDomainName=store-gigantti-ProductCatalog#filter-sidebar");
})();

const reviewsApiUrl = "https://api.bazaarvoice.com/data/reviews.json?apiversion=5.5&passkey=m643138kdkbls39wyjo7k8nn5&filter=productid:eq:FOOBAR&excludeFamily=true&Sort=Rating:desc&Limit=100& ";
const fetchReviews = (product, variation, sku) => {
    let url = reviewsApiUrl.replace("FOOBAR", sku);
    axios.get(url)
    .then(function (response) {
     response.data.Results.map(async (review) => {
        let [newReview, created] = await models.Review.findOrCreate({
            where: {
                ext_id: review.Id
            },
            defaults: {
                score: review.Rating,
                title: review.Title,
                text: review.ReviewText.replace(/(\r\n|\n|\r)/gm," "),
                reviewedAt: review.SubmissionTime,
                origin: 'gigantti.fi', // TODO make better thing for this, 
            }}).all();

            // If this review was new one, then add it. otherwise, skip.
            if (created) {
                variation.addReview(newReview);
                product.addReview(newReview);
            }
        });
    })
    .catch(function (error) {
      // handle error
      console.log("Nyt mentiin reviewin catch -lohkoon");
      console.log(error);
    });
};

const findManufacturer = async (model) => {
    return await models.sequelize.query(
        "SELECT * FROM brands WHERE :model ilike name || '%'",
        {
            replacements: { model: model },
            type: QueryTypes.SELECT,
            model: models.Review,
            plain:true
      });
} 