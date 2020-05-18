// const jsdom = require('jsdom');
// const { JSDOM } = jsdom;
const Crawler = require('crawler');
// const HCCrawler = require('headless-chrome-crawler');
const axios = require('axios').default;

const DATA_PRODUCT_TYPE = 31158;
const DATA_MODEL_PHONE_TYPE = 31569;
const DATA_MANUFACTURER = 30170;
const DATA_MODEL = 30879;
const DATA_COLOR = 30290;
const DATA_MANUFACTURER_COLOR = 32036;
const DATA_MANUFACTURER_MODEL_CODE = 31416;
const DATA_MODEL_CODE = 30878;
const DATA_STORAGE = 30718;

const models = require('../models/index');
const technical_info_url = 'https://www.gigantti.fi/INTERSHOP/web/WFS/store-gigantti-Site/fi_FI/-/EUR/CC_AjaxProductTab-Get?ProductSKU=FOOBAR&TemplateName=CC_ProductSpecificationTab';

(async () => {
    var c = new Crawler({
        maxConnections : 1,
        // This will be called for each crawled page
        callback : async function (error, res, done) {
            if(error){
                console.log(error);
            }else{
                console.log("Else triggeröity");
                var $ = res.$;
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
                        image: 'https://i.picsum.photos/id/197/200/200.jpg'
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
                console.log("C2 tekee duunia  nyt");
                //console.log(res);
                let $ = res.$;
                let foo = {
                    display_name: res.options.title,
                    product_type: $("td[data-md-value-id='"+DATA_PRODUCT_TYPE+"']").text(),
                    color: $("[data-md-value-id='"+DATA_COLOR+"']").text(),
                    manufacturer: $("[data-md-value-id='"+DATA_MANUFACTURER+"']").text(),
                    manufacturer_color: $("[data-md-value-id='"+DATA_MANUFACTURER_COLOR+"']").text(),
                    model: $("[data-md-value-id='"+DATA_MODEL+"']").text(),
                    model_code: $("[data-md-value-id='"+DATA_MODEL_CODE+"']").text(),
                    storage: $("[data-md-value-id='"+DATA_STORAGE+"']").text(),
                    ean: $(".spec-table td:contains(EAN-koodi)").next('td').html(),
                    model_code_2: $("[data-md-value-id='"+DATA_MANUFACTURER_MODEL_CODE+"']").text(),
                    sku: res.options.sku,
                    categories: res.options.categories
                };
                console.log(foo);
                if (foo.model_code_2 && (foo.model).includes(foo.model_code_2)) {
                    foo.model = (foo.model).replace(foo.model_code_2, '').trim();
                }

                // If product name has manufacturer name in it, remove it
                if (foo.manufacturer && String(foo.model).includes(foo.manufacturer)) {
                    foo.model = (foo.model).replace(foo.manufacturer, '').trim();
                }

                let name = foo.manufacturer.trim() + ' ' + foo.model.trim();
                console.log("Teen tuotteen, jonka nimeksi tulee: " + name);
                let variation_name = name + ", " + foo.storage + " " + foo.color + " " + foo.model_code + " " + foo.model_code_2;
                console.log("Variaation nimeksi voisi tulla: " + name + ", " + foo.storage + " " + foo.color + " " + foo.model_code + " " + foo.model_code_2);
                
                try {
                    
                    //let model = foo.model ? foo.model : foo.display_name ? foo.display_name : 'TUNTEMATON SOTILAS';
                    let [product,created] = await models.Product.findOrCreate({where: {model: name}, }).all();
                    console.log(product.id, created);
                    if (! created && res.options.image) {
                        console.log("Päivitetään tuotteen kuvaksi: " + res.options.image);
                        product.image = res.options.image;
                        await product.save()
                    }

        
                    let [variation,createdV] = await models.Variation.findOrCreate({
                        where: {
                            ean: foo.ean
                        },
                        defaults: {
                            display_name: variation_name,
                            model_code: foo.model_code ? foo.model_code : null,
                            data: foo
                        }
                    }).all();
        
                    if (variation.id) {
                        let variation_set = await product.addVariation(variation.id);
                        console.log("Asetettiinko variaatiota " + variation.id + " tuotteelle?");
                        if(variation_set) {
                            console.log("Kyllä asetettiin!");
                        }
                        fetchReviews(product, variation, foo.sku);
                    }
                } catch (err) {
                    console.log("Nyt tuli virhe try-lohkon sisällä");
                    console.log(err);
                    console.log(foo);
                    throw new Error("foo");
                }
            }
            done();
        }  
    });

  console.log("Haetaan kaikki Applen hakusanaa vastaavat puhelimet ja laitetaan jokainen crawlauksen alle");
  //c.queue("https://www.gigantti.fi/catalog/puhelimet-ja-gps/fi-puhelimet/puhelimet?SearchParameter=%26%40QueryTerm%3D*%26ContextCategoryUUID%3DstmsGQV5fqMAAAFDI7k2st6C%26discontinued%3D0%26Malli%3DiPhone%2B11%2BPro%2BMax_or_iPhone%2B11_or_iPhone%2B11%2BPro%26ManufacturerName%3DApple%26online%3D1%26%40Sort.ViewCount%3D1%26%40Sort.ProductListPrice%3D0&PageSize=80&ProductElementCount=&searchResultTab=Products&CategoryName=fi-puhelimet&CategoryDomainName=store-gigantti-ProductCatalog#filter-sidebar");
  c.queue("https://www.gigantti.fi/catalog/puhelimet-ja-gps/fi-puhelimet/puhelimet?SearchParameter=%26%40QueryTerm%3D*%26ContextCategoryUUID%3DstmsGQV5fqMAAAFDI7k2st6C%26discontinued%3D0%26ManufacturerName%3DApple%26online%3D1%26%40Sort.ViewCount%3D1%26%40Sort.ProductListPrice%3D0&PageSize=80&ProductElementCount=&searchResultTab=Products&CategoryName=fi-puhelimet&CategoryDomainName=store-gigantti-ProductCatalog#filter-sidebar");
})();

const reviewsApiUrl = "https://api.bazaarvoice.com/data/reviews.json?apiversion=5.5&passkey=m643138kdkbls39wyjo7k8nn5&filter=productid:eq:FOOBAR&excludeFamily=true&Sort=Rating:desc&Limit=100&filter=contentlocale:eq:fi_FI";
const fetchReviews = (product, variation, sku) => {
    let url = reviewsApiUrl.replace("FOOBAR", sku);
    axios.get(url)
    .then(function (response) {
     response.data.Results.map(async (review) => {
        console.log("--ARVOSTELU--");
        console.log("Tähtiä: ", review.Rating);
        console.log("Otsikko: ", review.Title);
        console.log("Arvostelu: ", review.ReviewText);

        let [newReview, created] = await models.Review.findOrCreate({
            where: {
                ext_id: review.Id
            },
            defaults: {
                score: review.Rating,
                title: review.Title,
                text: review.ReviewText.replace(/(\r\n|\n|\r)/gm," "),
                //created_at: review.SubmissionTime
            }}).all();
        if(newReview) {
            variation.addReview(newReview);
            product.addReview(newReview);
        } else {
            console.log("________MENI ARVOSTELU HUTI JOSTAIN SYYSTä________");
        }
    });
    })
    .catch(function (error) {
      // handle error
      console.log("Nyt mentiin reviewin catch -lohkoon");
      console.log(error);
    });
};

