
const {QueryTypes} = require('sequelize');

module.exports = {
    products: async (args,context,info) => {
        let whereCondition = {};
        if (args.id) {
            whereCondition = {
                id: args.id
            }
        }

        console.log(args);

        // If categoryId provided, show only products for that category
        if (args.catId) {
            whereCondition = {...whereCondition, categoryId: args.catId};
        }

        let req = false;
        if (args.required) {
            req = true;
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
                    // TODO: limit 1 here of only the recent review text is needed!!!!
                    include: {
                        model: context.models.Variation,
                        include: {
                            model: context.models.Price,
                            include: {
                                model: context.models.Shop
                            }

                        }
                    },
                    required: req
                },
            ],
            order: [
                ['reviews','reviewed_at','desc']
            ],
        });

        return products ? products : [];
    }



}