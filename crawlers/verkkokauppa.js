// Verkkoksen api: APPLE iPhone 11 Pro -> https://web-api.service.verkkokauppa.com/search?context=category_page&contextFilter=10216d
// https://regex101.com/r/wnn8Ig/3/

const models = require('../models/index');
const axios = require('axios').default;
const {Op,QueryTypes } = require("sequelize");
const utils = require('./utils');
let Shop;

let category_map = {
    '438b': 'Televisiot',
    '658b': 'Puhelimet',
    '1500b': ''
};

//let lastentarvikkeet = "https://web-api.service.verkkokauppa.com/search?context=category_page&contextFilter=55a&sort=releaseDate%3Adesc&rrSessionId=220730d5-d247-4037-b559-01fc5fd197be&rrRcs=eF5jYSlN9jAwMEs1TEw21jVJNDXVNTFKBhImaUm6poamySaJFiZmRmYpXLllJZkpfJYWlrqGuoYAf0wN0A";
//let iphone11 = "https://web-api.service.verkkokauppa.com/search?filter=category%3A10215d&filter=category%3A10216d&filter=category%3A10217d&query=iphone+11&rrSessionId=8c4fb94c-fb35-4436-846f-6bbe2d4034e7&rrRcs=eF5j4cotK8lM4bO0sNQ11DVkKU32MDAwSzVMTDbWNUk0NdU1MUoGEiZpSbqmhqbJJokWJmZGZikAgl4N0A";
let televisiot ="https://web-api.service.verkkokauppa.com/search?pageNo=1&context=category_page&contextFilter=438b&rrSessionId=227cb921-d20d-4e07-b65b-b4661f509281&rrRcs=eF5jYSlN9jAwMEs1TEw21jVJNDXVNTFKBhImaUm6poamySaJFiZmRmYpXLllJZkpfJYWlrqGuoYAf0wN0A";
let reviews_url = "https://web-api.service.verkkokauppa.com/product/FOOBAR/reviews?pageNo=MUFASA";

const setStore = async () => {
    if (! Shop) {
        Shop = await utils.assignStore({name: 'Verkkokauppa'});
        if (null === Shop) {
            return false;
        }
    }

    for (let i = 0; i < 15; i++) {
        console.log("\n\nPYYNTÖ LÄHTEE\n\n");
        let url = "https://web-api.service.verkkokauppa.com/search?pageNo="+i+"&context=category_page&contextFilter=438b&rrSessionId=227cb921-d20d-4e07-b65b-b4661f509281&rrRcs=eF5jYSlN9jAwMEs1TEw21jVJNDXVNTFKBhImaUm6poamySaJFiZmRmYpXLllJZkpfJYWlrqGuoYAf0wN0A";
        await getFromUrl(lastentarvikkeet);
    }

}

async function getFromUrl(url) {
    axios.get(url)
    .then(function (response) {
        response.data.products
        .filter(product => '11278c' !== product.category.id)
        .filter(product => (Array.isArray(product.eans) && product.eans.length > 0) || (Array.isArray(product.mpns) && product.mpns.length > 0))
        .map(async (product) => {
            let name = product.name.fi;
            let brand = product.brand.name;
            let model_codes = product.mpns;
            let price = product.price.current;
            let eans = product.eans;
            let pid = product.pid; // Verkkis internal id, reviews link.
            let img =product.images[0].orig ? product.images[0].orig : null;

            let category = await checkCategory(product.category.path);
            let data = {
                name: product.name.fi,
                brand: product.brand.name,
                model_codes: product.mpns,
                price: product.price.current,
                eans: product.eans,
                pid: product.pid,
                img: img,
                categories: product.category.path,
                origin: Shop.get('name')
            };

            console.log("Category: ", category);
            console.log("Nimi: ", name);
            console.log("Merkki: ", brand);
            console.log("Mallikoodit: ", model_codes);
            console.log("Hinta: ", price);
            console.log("EAN-koodit: ", eans);

            name = await utils.addBrandToName(brand,name);
            // Clean unnecessary info from product name (verkkis-suitable formatted names)
            // Fallback to name as found on site.
            let result = name.match(/^(.*?((?=\W?\d{2,3}\W?Gt)|(?=\W-)))/g);
            let display_name = Array.isArray(result) ? result.pop() : name;

            let variation, p;

            try {

                // FIND VARIATIONS USING MODEL CODES AND EAN CODES FOUND FROM VERKKOKAUPPA
                let variations = await utils.findVariationsByNameOrEanOrModelCodes(model_codes, eans,display_name);
                if (variations.length === 0) {

                    if (await utils.isDataValidForCreation(data.eans,data.model_codes)) {
                        if (!category) {
                        //    throw new Error("Yritin luoda uutta tuotetta: " + display_name + ", mutta kategoriatiedot ovat puutteelliset");
                        }
                        p = await utils.createNewProduct(display_name, img);
                        console.log("Luotiinko uusi product? ", p.get('id'));

                        console.log("Nyt luodaan uusi variaatio tuotenimellä: ", display_name);
                        variation = await utils.createNewVariation(display_name, data);
                        console.log("Luotiinko uusi variation? ", variation.get('id'));
                        await p.addVariation(variation.get('id'));
                        await variation.reload();
                    } else {
                        console.log("Data is not suitable for generating new product, skip", data);
                    }
                } else {
                    console.log("Variations: ", variations);
                    variation = await models.Variation.findByPk(variations.shift());
                    //p = await models.Product.findByPk(variation.get('product_id'));
                }

                if (variation !== null) {
                    console.log("Päivitetään hintatiedot, variaatio_id: ", variation.get('id'));
                    await updatePrice(variation, price)
                    console.log("Päivitetään arvostelut, variaatio_id: " + variation.get('id'));
                   await fetchReviews(variation, pid);
                }
            } catch(error) {
                console.log(error);
            };

        });

    }).catch(function(error) {
        console.log("Verkkis error: ",error);
    });
}


// Loop through product category list. If we find any category predefined in category_map - object, return it.
async function checkCategory(categories) {
    let mapped_cat = null;
    categories.some((pc) => {
        if (pc.id in category_map) {
            mapped_cat = category_map[pc.id];
            return true;
        }
        return false;
    });
    return mapped_cat;
}

async function updatePrice(variation, priceVal) {
    console.log("Päivitetään updatePrice, variaatio_id: " + variation.get('id') + ", kauppa-id: " + Shop.get('id'));
    let [price,createdPrice] = await models.Price.findOrCreate({
        where: {
            variation_id: variation.get('id'),
            shop_id: Shop.get('id'),
        },
        defaults: {
            price: priceVal
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
        price.changed('price', price);
        await price.save()
    }
}

async function fetchReviews(variation, pid) {
    let url = reviews_url.replace('FOOBAR', pid);
    try {
        let ext_ids = await models.sequelize.query("SELECT COALESCE(array_agg(ext_id), ARRAY[]::varchar[]) AS ext_ids FROM reviews WHERE variation_id = :variation_id",
        {
            replacements: {variation_id: variation.get('id')},
            type: QueryTypes.SELECT,
            raw:true
        });

        let existing = ext_ids.shift().ext_ids;
        let product = await models.Product.findByPk(variation.get('productId'));
        console.log("Käsittelen variaatiota " + variation.get('id') + ", Product noudettu, se on tässä: " +  product.get('id'));
        // Fetch reviews from api endpoint.
        // Filter only this variation specific reviews.
        // Filter only new reviews (review.id must not be found in this variation review ext ids.)

        const fetchData = (url, i) => {
            let replacedUrl = url.replace('MUFASA', i);
            axios.get(replacedUrl).then((response) => {
                response.data.reviews
                .filter(review => review.ProductId === pid)
                .filter(review => ! existing.includes(review.Id))
                .map(async(review) => {
                    let [newReview, created] = await models.Review.findOrCreate({
                        where: {
                            ext_id: review.Id
                        },
                        defaults: {
                            score: review.Rating,
                            title: review.Title,
                            text: review.ReviewText.replace(/(\r\n|\n|\r)/gm," "),
                            origin: 'verkkokauppa.com',
                            reviewedAt: review.SubmissionTime
                        }}).all();
                    if(newReview) {
                        await variation.addReview(newReview);
                        await product.addReview(newReview);
                    } else {
                        console.log("________MENI ARVOSTELU HUTI JOSTAIN SYYSTä________");
                    }
                })
                return response;
            }).then((response) => {
                if (i < response.data.numPages) {
                    console.log("Olin sivulla " + i + ", numPages sanoo että on: " + response.data.numPages + " kutsun siis uudestaan seuraavaa sivua");
                    fetchData(url, ++i);
                }
            })
        }
        fetchData(url,0);

    } catch (err) {
        console.log(err);
    }

}

setStore();
