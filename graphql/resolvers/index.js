const productResolver = require('./product');
const searchResolver = require('./search');

const rootResolver = {
    ...productResolver,
    ...searchResolver
};

module.exports = rootResolver;