const productResolver = require('./product');
const searchResolver = require('./search');
const categoryResolver = require('./category');
//const variationResolver = require('./variation');
const familyResolver = require('./family');

const rootResolver = {
    ...productResolver,
    ...searchResolver,
    ...categoryResolver,
    ...familyResolver,
    //...variationResolver
};

module.exports = rootResolver;