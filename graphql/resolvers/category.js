const {Sequelize, Op} = require('sequelize');

module.exports = {
    categories: async (args,context,info) => {
        const categories = await context.models.Category.findAll({ hierarchy: true });

        return categories ? categories : [];
    }
}