const productResolver = require('./product');
const searchResolver = require('./search');
const categoryResolver = require('./category');
const variationResolver = require('./variation');

const rootResolver = {
    ...productResolver,
    ...searchResolver,
    ...categoryResolver,
    ...variationResolver
};

module.exports = rootResolver;