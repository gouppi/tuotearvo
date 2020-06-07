const productResolver = require('./product');
const searchResolver = require('./search');
const categoryResolver = require('./category');
const reviewResolver = require('./review');

const rootResolver = {
    ...productResolver,
    ...searchResolver,
    ...categoryResolver,
    ...reviewResolver,
};

module.exports = rootResolver;