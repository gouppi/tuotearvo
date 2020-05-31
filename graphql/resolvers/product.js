
const {QueryTypes} = require('sequelize');

module.exports = {
    products: async (args,context,info) => {
        let whereCondition = {};
        if (args.id) {
            whereCondition = {
                id: args.id
            }
        }

        let categoryWhere = {};
        if (args.categorySeoName) {
            categoryWhere = {seo_name: args.categorySeoName};
        }


        // TODO: front page resolver needs only 1 possible review?
        // TODO: This resolver is used on front page and on product-page.
        // There might be cases when no reviews are found.
        let products = await context.models.Product.findAll({
            where: whereCondition,
            limit: args.limit ? args.limit : null,
            include: [
                {
                    model: context.models.Review,
                },
                {
                    model: context.models.Family,
                },
                {
                    model: context.models.Category,
                    where: categoryWhere
                }

            ],

            order: [
                ['reviews','reviewed_at','desc']
            ],
        });


        // TODO How to get review-association counts calculated to own key through Sequelize?
        products = products.map((product) => {
            product.reviews_count = product.reviews.length;
            return product;
        });

        return products ? products : [];
    },


    productFilters: async (args,context,info) => {
        let categories = await context.models.Category.findAll({hierarchy:true});

    }



}