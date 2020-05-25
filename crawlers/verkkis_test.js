const axios = require("axios").default;

const utils = require("./utils");

let base_url =
    "https://web-api.service.verkkokauppa.com/search?context=category_page&contextFilter=!CATEGORY!&sort=releaseDate%3Adesc&rrSessionId=7d32a47e-e69a-4984-9075-b4f6bd3ef05c&rrRcs=eF5jYSlN9jAwMEs1TEw21jVJNDXVNTFKBhImaUm6poamySaJFiZmRmYpXLllJZkpfJYWlrqGuoYAf0wN0A&pageNo=!PAGENUM!";

let shop = 'Verkkokauppa';

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
];

/**
 *
 * @param {*} i
 * @param {*} url
 * @param {*} dataGroups
 */
const groupData = async (i, url, dataGroups) => {
    console.log("groupData, ollaan menossa indeksissä numero " + i);
    console.log("DataGroupsin sisällä on " + Object.keys(dataGroups).length + " avainta");
    let response = await axios.get(url.replace("!PAGENUM!", i));
    response.data.products
        .filter((product) => product.bundleProducts.length === 0)
        .map((product, j) => {
            console.log("Prosessoidaan kierroksen: " + i + " tuotetta: " + j);
            buildProductJsonData(product, dataGroups);
            return true;
        });

    if (response.data.numPages && response.data.numPages > i) {
        dataGroups = await groupData(++i, url, dataGroups);
    }
    return dataGroups;
};

const init = ( async() => {
    shop = await utils.assignStore(shop);

    if (null === shop) {
        console.log("No shop assigned.");
        return false;
    }

    for (let i = 0; i < categories.length; i++) {
        let c = categories[i];
        console.log("Käsitellään kategoriaa "+ c.name + " - " + c.code);
        let url = base_url.replace('!CATEGORY!', c.code);
        let data = await groupData(0, url, {});
        console.log("Kategoria: " + c.name + " käsitelty, prosessoidaan data");
        console.log(data);

        utils.handle(data, c, shop);
    }
});
//init();

const foobar = ( async() => {
    //let shop = await utils.assignStore(shop);

    let data = [{
        name_original: "Foobar lorem ipsum 123",
        name_parsed: "Sony Xperia 10 II",
        category: {
            id: "4793c",
            name: "Android",
            path: [
              {
                  name: "Puhelimet",
                  id: "22a"
              },
              {
                  name: "Puhelimet",
                  id: "658b"
              },
              {
                  name: "Android",
                  id: "4793c"
              }
              ]
        },
        brand: {
              name:"Sony Mobile Communications",
              link:"http://www.sonymobile.com/global-en/"
        },
        mpns: ["XQAU52W.EEAC"],
        eans: ["0000000123123","0000000242424"],
        price: 369,
        external_id: "51649",
        product_page_link: "/fi/product/51649/nkfxc/Sony-Xperia-10-II-Android-puhelin-Dual-SIM-128-Gt-valkoinen",
        images: []
      }];

    await utils.handle(data, categories[0], null);

});

foobar();



/**
 *
 * @param {*} product
 * @param {*} dataGroups
 */
const buildProductJsonData = (product, dataGroups) => {
    let parsed_name = getPlainName(product.name.fi, product.category.id);
    let productJson = {
        name_original: product.name.fi,
        name_parsed: parsed_name,
        category: {
            id: product.category.id,
            name: product.category.name,
            path: product.category.path,
        },
        brand: {
            name: product.brand.name,
            link: product.brand.url,
        },
        mpns: product.mpns,
        eans: product.eans,
        price: product.price.current,
        external_id: product.productId,
        product_page_link: product.href.fi,
        images: product.images,
    };
    return dataGroups.push(productJson);
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