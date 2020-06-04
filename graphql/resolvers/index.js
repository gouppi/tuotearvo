const productResolver = require('./product');
const searchResolver = require('./search');
const categoryResolver = require('./category');
const familyResolver = require('./family');
const reviewResolver = require('./review');

const rootResolver = {
    ...productResolver,
    ...searchResolver,
    ...categoryResolver,
    ...familyResolver,
    ...reviewResolver,
};

module.exports = rootResolver;