// Verkkoksen api: APPLE iPhone 11 Pro -> https://web-api.service.verkkokauppa.com/search?context=category_page&contextFilter=10216d
// https://regex101.com/r/wnn8Ig/3/

const models = require('../models/index');
const axios = require('axios').default;
const {Op,QueryTypes } = require("sequelize");



let iphone11 = "https://web-api.service.verkkokauppa.com/search?filter=category%3A10215d&filter=category%3A10216d&filter=category%3A10217d&query=iphone+11&rrSessionId=8c4fb94c-fb35-4436-846f-6bbe2d4034e7&rrRcs=eF5j4cotK8lM4bO0sNQ11DVkKU32MDAwSzVMTDbWNUk0NdU1MUoGEiZpSbqmhqbJJokWJmZGZikAgl4N0A";
let reviews_url = "https://web-api.service.verkkokauppa.com/product/FOOBAR/reviews";


axios.get(iphone11)
    .then(function (response) {
        response.data.products.map(async (product) => {
            let name = product.name.fi;
            let brand = product.brand.name;
            let model_codes = product.mpns;
            let price = product.price.current;
            let eans = product.eans;
            let pid = product.pid; // Verkkis internal id, reviews link.

            console.log("Nimi: ", name);
            console.log("Merkki: ", brand);
            console.log("Mallikoodit: ", model_codes);
            console.log("Hinta: ", price);
            console.log("EAN-koodit: ", eans);

            // Pad every EAN to prepend leading zeros until 13 chars.
            let eans_json = eans.map((ean) => ({ean:ean.padStart(13, '0')}));

            // If brand is not empty but name doesn't contain it, prepend name with brand.
            if (brand && !name.toLowerCase().includes(brand.toLowerCase())) {
                name = `$(brand) $(name)`;
            }
            name = name.charAt(0).toUpperCase() + name.slice(1);
            
            // Clean unnecessary info from product name (verkkis-suitable formatted names)
            // Fallback to name as found on site.
            let result = name.match(/^(.*?((?=\W?\d{2,3}\W?Gt)|(?=\W-)))/g);
            let display_name = Array.isArray(result) ? result.pop() : name;
            
            // TODO: you always should search using EAN-code / model_code based variations!
            // If no variations are found using these, last resort is to try name-search for product.
            // IF both fail, make a new product.

            try {
                let variation = await models.Variation.findAll({
                    where: {
                        [Op.or]: eans_json
                    }
                });
                // Ean-code is matched to existing variation.
                /* TODO: Join multiple found variations to each other */
                let v1 = null;
                
                if (Array.isArray(variation)) {
                    console.log("On array");
                    v1 = variation.shift();
                } else {
                    // TODO Try to find using product name
                     //let [product,created] = await models.Product.find
                    console.log(display_name + " --- not found matches");
                }
                console.log(v1);

                fetchReviews(v1, pid);

               
            } catch(error) {
                console.log("errori tuli: " , error);
            };

        });

    }).catch(function(error) {
        console.log("Verkkis error: ",error);
    });


async function fetchReviews(variation, pid) {
    let url = reviews_url.replace('FOOBAR', pid);
    try {
        let ext_ids = await models.sequelize.query("SELECT COALESCE(array_agg(ext_id), ARRAY[]::varchar[]) AS ext_ids FROM reviews WHERE variation_id = :variation_id", 
        {
            replacements: {variation_id: variation.id}, 
            type: QueryTypes.SELECT,
            raw:true
        });
        let existing = ext_ids.shift().ext_ids;
        let product = await models.Product.findByPk(variation.productId);
        console.log("Product noudettu, se on: ", product.id);
        // Fetch reviews from api endpoint.
        // Filter only this variation specific reviews.
        // Filter only new reviews (review.id must not be found in this variation review ext ids.)
        axios.get(url)
        .then((response) => {
            response.data.reviews
            .filter(review => review.ProductId == pid)
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
                        origin: 'verkkokauppa.com'
                        //created_at: review.SubmissionTime
                    }}).all();
                if(newReview) {
                    await variation.addReview(newReview);
                    await product.addReview(newReview);
                } else {
                    console.log("________MENI ARVOSTELU HUTI JOSTAIN SYYSTä________");
                }

                
    
            })
        });

    } catch (err) {
        console.log(err);
    }

}