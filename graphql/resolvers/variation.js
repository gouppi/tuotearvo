const {Sequelize, Op} = require('sequelize');

module.exports = {
    variationPrices: async (args,context,info) => {
        // const categories = await context.models.Category.findAll({ hierarchy: true });
        // return categories ? categories : [];
        const variations = await context.models.Variation.findAll({where: {product_id: 240}, hierarchy: true})
        return variations ? variations : [];   
    }
}