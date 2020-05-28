const productResolver = require('./product');
const searchResolver = require('./search');
const categoryResolver = require('./category');
//const variationResolver = require('./variation');
const familyResolver = require('./family');
const reviewResolver = require('./review');

const rootResolver = {
    ...productResolver,
    ...searchResolver,
    ...categoryResolver,
    ...familyResolver,
    ...reviewResolver,
    //...variationResolver
};

module.exports = rootResolver;