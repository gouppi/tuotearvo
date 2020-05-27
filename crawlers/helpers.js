const models = require('../models/index');
const axios = require('axios').default;
const {Op,QueryTypes } = require("sequelize");
const maps = require('./map');

let brands;

/**
 * Finds and returns Shop with given parameters
 * @param {JSON} params JSON key-value pair search query
 * @example {name: 'Verkkokauppa'}
 * @returns Shop ORM object or NULL
 */
const assignStore = async (name) => {
    return await models.Shop.findOne({where: {name: name}});
}

/**
 * Checks if name contains brand in it.
 * If brand is not empty but name doesn't contain it, prepend name with brand.
 *
 * @param {string} brand Products brand name
 * @param {string} name Products name as found from shop
 * @returns Product name prepended with possible brand name
 */
const addBrandToName = async(brand,name) => {
    if (brand.length > 0 && !name.toLowerCase().includes(brand.toLowerCase())) {
        name = `${brand} ${name}`;
    }
    return name.charAt(0).toUpperCase() + name.slice(1);
}


/**
 * Tries to find brand based on either direct manufacturer name or product name
 * @param {string} manufacturer
 * @param {StringConstructor} display_name
 */

// TODO : MITEN TÄMÄ SAADAAN SIIRRETTYÄ BRANDS MODELIN ALLE??????

const findBrand = async (brand, display_name)  => {
    let Brand = await models.sequelize.query("SELECT * FROM brands WHERE name = :brand OR :display_name ILIKE name || '%'",
    {
        replacements: {
            brand: brand,
            display_name:display_name
        },
        model: models.Brand,
        plain:true
    });
    if (!Brand) {
        throw new Error("Couldn't find brand for " + brand);
    }
    return Brand;
}


/**
 * Makes sure that we have necessary data for creating new variation.
 * If we can't create variation, there is no need for creating product, either.
 * @param {JSON} payload
 * @returns {boolean}
 */
const isDataValidForCreation = async (data) => {
    return true;
}

const createNewProduct = async(p) => {
    try {
        isDataValidForCreation(p);
        let P = await models.Product.create({
            group_name: p.name_parsed,
            name: p.name,
            image: 'https://www.image.here',
            product_eans: p.eans.map((ean) => ({ean: ean})),
            product_mpns: p.mpns.map((mpn) => ({mpn:mpn})),
        }, {
            include: [{
                model: models.Ean,

            },{
                model: models.Mpn,

            }]
        });
        return P;
    } catch (err) {
        console.log(err);
    }
    return null;
}

const findCategory = async(c) => {
    // From top to bottom
    try {
        let reverse = c.reverse();
        let C;
        for (let i = 0; i < reverse.length; i++) {
            let name = reverse[i].name; // "4793c"
            C = await models.Category.findOne({where:{name:name}});
            if (C) break;
        }

        if (! C) {
            throw new Error("Can't map categories to any existing one");
        }
        return C;
    } catch (err) {
        console.log(err)
        return null;
    }
}


/**
 * This function handles the whole data processing in one slot.
 * Crawlers call this function only after data harvesting.
 * @param {JSON} payload contains all necessary information for creating new product, variation.
 * @param {JSON} category contains category name and external code information
 * @param {String} shop Name of the shop, e.g. "Verkkokauppa.com"
 */
const handle = async (payload, shop) => {
    for (let i = 0; i < payload.length; i++) {
        try {
            let products = await models.Product.findProducts(payload[i])
            let P = products.shift();
            if (! P) {
                let C = await findCategory(payload[i].category);
                let B = await findBrand(payload[i].brand.name, payload[i].name);
                P = await createNewProduct(payload[i]);
                C.addProduct(P);
                B.addProduct(P);
            }

            if (!P) {
                throw new Error("Didn't create new product " + payload[i].name);
            }




        }

        catch (err) {
            console.log(err);
        }

    }
}


exports.assignStore = assignStore;
exports.addBrandToName = addBrandToName
exports.createNewProduct = createNewProduct
exports.isDataValidForCreation = isDataValidForCreation
exports.findBrand = findBrand
exports.handle = handle
exports.findCategory = findCategory