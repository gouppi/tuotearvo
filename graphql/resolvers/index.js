const productResolver = require('./product');
const searchResolver = require('./search');
const categoryResolver = require('./category');

const rootResolver = {
    ...productResolver,
    ...searchResolver,
    ...categoryResolver
};

module.exports = rootResolver;