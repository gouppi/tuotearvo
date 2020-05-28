const axios = require("axios").default;
const helpers = require("./helpers");

let base_url =
    "https://web-api.service.verkkokauppa.com/search?context=category_page&contextFilter=!CATEGORY!&sort=releaseDate%3Adesc&rrSessionId=7d32a47e-e69a-4984-9075-b4f6bd3ef05c&rrRcs=eF5jYSlN9jAwMEs1TEw21jVJNDXVNTFKBhImaUm6poamySaJFiZmRmYpXLllJZkpfJYWlrqGuoYAf0wN0A&pageNo=!PAGENUM!";

let shop = 'Verkkokauppa';
let reviews_url = "https://web-api.service.verkkokauppa.com/product/!PRODUCTID!/reviews?pageNo=!PAGENUM!"

let categories = [
    {
        "name": "Android-puhelimet",
        "parent": "Puhelimet",
        "code": "4793c"
    },
    {
        "name": "iPhone-puhelimet",
        "parent": "Puhelimet",
        "code": "10411c",
    },
    {
        "name": "Erikoispuhelimet",
        "parent": "Puhelimet",
        "code": "4808c"
    },
    {
        "name": "Peruspuhelimet",
        "parent": "Puhelimet",
        "code": "4813c",
    },
    {
        "name": "Radiopuhelimet",
        "parent": "Puhelimet",
        "code": "6504c"
    },
    {
        "name": "Televisiot",
        "parent": "TV ja Video",
        "code": "438b"
    }
];


/**
 *
 * @param {*} i
 * @param {*} url
 */
const groupData = async (i, url) => {
    console.log("groupData, ollaan menossa indeksissä numero " + i);
    let response = await axios.get(url.replace("!PAGENUM!", i));

    for (let i = 0; i < response.data.products.length; i++) {
        let p = response.data.products[i];
        if (p.bundleProducts.length > 0) {
            continue;
        }

        let json = buildProductJsonData(p);
        let Product = await helpers.handle(json, shop);
        if (null === Product) {
            console.log("Ei löydetty/luotu tuotetta: ", json.name);
            continue;
        }

        await fetchReviews(Product,0);
    }

    if (response.data.numPages && response.data.numPages > i) {
        await groupData(++i, url);
    }
    return true;
}


const init = (async () => {
    shop = await helpers.assignStore(shop);

    if (null === shop) {
        console.log("No shop assigned.");
        return false;
    }

    for (let i = 0; i < categories.length; i++) {
        let c = categories[i];
        console.log("Käsitellään kategoriaa " + c.name + " - " + c.code);
        let url = base_url.replace('!CATEGORY!', c.code);
        await groupData(0, url);
        console.log("Kategoria: " + c.name + " käsitelty, prosessoidaan data");
    }
});
init();


/**
 *
 * @param {*} product
 * @param {*} dataGroups
 */
const buildProductJsonData = (product, dataGroups) => {
    let parsed_name = getPlainName(product.name.fi, product.category.id);
    let image = product.images.shift();
    image = image.hasOwnProperty('orig') ? image.orig : null;
    let productJson = {
        name: product.name.fi,
        name_parsed: parsed_name,
        category: product.category.path,
        brand: {
            name: product.brand.name,
            link: product.brand.url,
        },
        mpns: product.mpns,
        eans: product.eans,
        price: product.price.current,
        external_id: product.pid,
        product_page_link: product.href.fi,
        image: image,
        images: product.images
    };
    return productJson;
}

/**
 * Returns parsed product name (base name) for given product.
 * @param {String} name product name
 * @param {*} category_id  product category
 */
const getPlainName = (name, category_id) => {
    if (skipParsingForCategory(category_id)) {
        return name;
    }

    let returnable = name;
    let parsing_rules = getAdditionalRules(category_id);
    if (parsing_rules) {
        returnable = name.split(parsing_rules).shift();
    }

    // Remove regex only if split was successful, otherwise use whole name
    if (returnable !== name) {
        let regex = new RegExp(/\W?\d{2,3}\W?[g][b|t]/gi);
        returnable = returnable.replace(regex, "").trim();
    }

    return returnable;
};

/**
 * Returns additional product name parsing rules for given category
 * @param {String} category_id
 */
const getAdditionalRules = (category_id) => {
    let parse_rules = {
        "4793c": new RegExp(/-?Android/gi),
        "4820c": new RegExp(/-?konferenssikaiutin|-?kaiutinmikrofoni/gi),
        "438b": new RegExp(/-televisio/gi),
    };
    return parse_rules.hasOwnProperty(category_id)
        ? parse_rules[category_id]
        : new RegExp(/\W-/gi);
};

/**
 * Checks for current product category code, skips categories where no name parsing is needed.
 * @param {String} category_id
 */
const skipParsingForCategory = (category_id) => {
    let skip_list = [
        "2889d", // Konferenssikaiuttimet - tarvikkeet
        "4786c", // Pöytä-GSM
        "118b", // Web-kamerat
    ];
    return skip_list.includes(category_id);
};


const fetchReviews = async (Product, i) => {
    let url = reviews_url.replace('!PRODUCTID!', Product.get('fetch_data').external_id).replace('!PAGENUM!', i);
    let response = await axios.get(url);

    for (let i = 0; i < response.data.reviews.length; i++) {
        let review = response.data.reviews[i];
        let reviewData = {
            external_id: review.Id,
            recommends: review.IsRecommended,
            rating: review.Rating,
            secondaryRatings: review.SecondaryRatings,
            reviewText: review.ReviewText,
            reviewTitle: review.Title,
            reviewedAt: review.SubmissionTime
        }
        let R = await helpers.createReview(reviewData,shop);
        if (!R ) {
            continue;
        }
        await Product.addReview(R);
    }

    if (response.data.hasOwnProperty('numPages') && response.data.numPages > i+1) {
        await fetchReviews(Product, ++i);
    }
    return true;
}