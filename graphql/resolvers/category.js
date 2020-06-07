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

        let parents = await category.getAncestors();
        category.parents = parents;
        return category;
    }
}