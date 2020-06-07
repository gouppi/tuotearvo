const {Sequelize, Op} = require('sequelize');

module.exports = {
    categories: async (args,context,info) => {
        const categories = await context.models.Category.findAll({ hierarchy: true });
        return categories ? categories : [];
    },

    category: async (args,context,info) => {
        let category;
        if (args.id) {
            category = await context.models.Category.findByPk(args.id);
        }
        else if (args.categorySeoName) {
            category = await context.models.Category.findOne({where:{seo_name: args.categorySeoName}});
        }
        return category;
    },

    filters: async (args, context, info) => {
        let category = await context.models.Category.findOne({
            where: {seo_name: 'puhelimet'},
            include: {
                model: context.models.Category,
                as: 'descendents',
                hierarchy: true
              }
        });
        let ids = category.children.map(child => {
            return child.id
        });
        ids.push(category.id);
        console.log("KategoriaIDt:", ids);
        return [];
    }
}