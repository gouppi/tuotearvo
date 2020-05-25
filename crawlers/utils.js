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
 * Tries to find existing product variation(s) by using given model- or ean-codes.
 *
 * @param {Array} ean an array of found EAN-codes from product.
 * @param {Array} Mpns found from product.
 * @returns {Array} An array containing possible product matches for this query
 */
const findMatchingProduct = async (ean,mpn,name) => {
    let processed = [];

    let search_params = [{name: name}];
    if (ean.length) {
        ean.map((ean) => search_params.push({ean:ean.padStart(13, '0')}));
    }

    let p1 = await models.Product.findAll({
        where: {
            [Op.or]: search_params
        },
        attributes: [['id']],
        raw:true
    });

    v1.map((v) => processed.push(v.variation_id));

    if (model_codes.length) {
        let model_codes_json = model_codes.map((model_code) => ({model_code: model_code.trim()}));
        let v2 = await models.VariationModelCode.findAll({
            where: {
                [Op.or]: model_codes_json
            },
            attributes: ['variation_id'],
            raw:true
        });
        v2.map((v) => processed.push(v.variation_id));
    }

    return [...new Set(processed)];
}

const createNewProduct = async(name, image) => {
    let p = await models.Product.findAll({
        where: {
            model: name
        }
    });

    if (!Array.isArray(p) || p.length === 0) {
        p = await models.Product.create({
            model: name,
            image: image,
        });
    } else {
        console.log("Notice: Found " + p.length + " products with name: " + name);
        p = p.shift();
    }

    return p;
}

const createNewVariation = async(name,data) => {
    // If both eans & model_codes are empty, there is nothing (except name) to match these.
    let variation = await models.Variation.create({
        ean: data.eans[0],
        display_name: name,
        model_code: data.model_codes[0],
        data: data
    });
    return variation;
}

/**
 * Makes sure that we have necessary data for creating new variation.
 * If we can't create variation, there is no need for creating product, either.
 * @param {Array} eans
 * @param {Array} model_codes
 * @returns {boolean}
 */
const isDataValidForCreation = async (eans,model_codes) => {
    if ((! Array.isArray(eans) ||eans.length === 0) &&
    (! Array.isArray(model_codes) ||model_codes.length === 0)) {
        return false;
    }
    return true;
}





/**
 * Tries to find brand based on either direct manufacturer name or product name
 * @param {string} manufacturer
 * @param {StringConstructor} display_name
 */
const findBrand = async (manufacturer, display_name)  => {
    let Brand = await models.sequelize.query("SELECT id FROM brands WHERE name = :manufacturer OR :display_name ILIKE name || '%'",
    {
        replacements: {
            manufacturer: manufacturer,
            display_name:display_name
        },
        model: models.Brand,
        plain:true
    });
    return Brand;

}

const findCategory = async(name) => {
    return await models.Category.findOne({where: {name: name}});
}

const findProducts = async(product) => {
    let params = [{name: product.name_original}];
        if (product.eans.length) {
            let res = product.eans.map((ean) => ({'$product_eans.ean$':ean.padStart(13,'0')}));
            params = params.concat(res);
        }
        if (product.mpns.length) {
            let res = product.mpns.map(mpn => ({'$product_mpns.mpn$':mpn}));
            params = params.concat(res);
        }
        // This is the part you're after.
        let P = await models.Product.findAll({
            where: {
                [Op.or]: params
            },
            include: [
                {model: models.Ean, as: models.Ean.tableName},
                {model: models.Mpn, as: models.Mpn.tableName}
            ]
        });
        return P;
}


/**
 * This function handles the whole data processing in one slot.
 * Crawlers call this function only after data harvesting.
 * @param {JSON} payload contains all necessary information for creating new product, variation.
 * @param {JSON} category contains category name and external code information
 * @param {String} shop Name of the shop, e.g. "Verkkokauppa.com"
 */
const handle = async (payload, category, shop) => {
    //let C = await findCategory(category.name);

    for (let i = 0; i < payload.length; i++) {
        let P = await findProducts(payload[i])
        console.log(P);
    }
}


exports.assignStore = assignStore;
exports.addBrandToName = addBrandToName
exports.findProducts = findProducts
exports.createNewProduct = createNewProduct
exports.createNewVariation = createNewVariation
exports.isDataValidForCreation = isDataValidForCreation
exports.findBrand = findBrand
exports.handle = handle