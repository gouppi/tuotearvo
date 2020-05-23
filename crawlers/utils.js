const models = require('../models/index');
const axios = require('axios').default;
const {Op,QueryTypes } = require("sequelize");
const maps = require('./map');

/**
 * Finds and returns Shop with given parameters
 * @param {JSON} params JSON key-value pair search query
 * @example {name: 'Verkkokauppa'}
 * @returns Shop ORM object or NULL
 */
const assignStore = async (params) => {
    return await models.Shop.findOne({where: params});
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
 * @param {Array} model_codes an array of found model codes from product. 
 * @param {Array} eans an array containing all ean codes found from product.
 * @returns {Array} an array containing variation ids matched to search query
 */
const findVariationsByNameOrEanOrModelCodes = async (model_codes, eans,name) => {
    let processed = [];

    let search_params = [{display_name: name}];
    if (eans.length) {
        eans.map((ean) => search_params.push({ean:ean.padStart(13, '0')}));
    }
    let v1 = await models.Variation.findAll({
        where: {
            [Op.or]: search_params
        },
        attributes: [['id', 'variation_id']],
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

// const checkCategory = async(category_name) => {
//     let mapped_cat = null;
//     categories.some((pc) => {
//         if (pc.id in category_maps) {
//             mapped_cat = category_maps[pc.id];
//             return true;
//         }
//         return false;
//     });
//     return mapped_cat;
// }


exports.assignStore = assignStore;
exports.addBrandToName = addBrandToName
exports.findVariationsByNameOrEanOrModelCodes = findVariationsByNameOrEanOrModelCodes
exports.createNewProduct = createNewProduct
exports.createNewVariation = createNewVariation
exports.isDataValidForCreation = isDataValidForCreation