
const {QueryTypes} = require('sequelize');

module.exports = {
    products: async (args,context,info) => {
        let whereCondition = {};
        if (args.id) {
            whereCondition = {
                id: args.id
            }
        }

        // If categoryId provided, show only products for that category
        if (args.catId) {
            whereCondition = {...whereCondition, categoryId: args.catId};
        }
        
        let req = false;
        if (args.required) {
            req = true;
        }
        
        // TODO: This resolver is used on front page and on product-page.
        // There might be cases when no reviews are found.
        let products = await context.models.Product.findAll({
            where: whereCondition,
            include: [
                {
                    model: context.models.Variation,
                },
                {
                    model: context.models.Category,
                },
                {
                    model: context.models.Brand
                },
                {
                    model: context.models.Review,
                    include: {
                        model: context.models.Variation
                    },
                    required: req,
                },
            ],
            order: [
                ['reviews','reviewed_at','desc']
            ]
        });

        return products ? products : [];
    },
     productInfo: async (args,context,info) => {
        let products = await context.models.sequelize.query(
            `SELECT products.id,
              products.model,
              products.image,
              count(reviews.id) AS reviews_count,
              ROUND(AVG(reviews.score), 1) AS average_score
              FROM products LEFT JOIN reviews ON (reviews.product_id = products.id) GROUP BY products.id`, {type: QueryTypes.SELECT}
        );
        return products ? products : [];
     } 
}

// events: async () => {
//     try {
//         const events = await Event.find();
//         return events.map(event => {
//             return transformEvent(event);
//         });
//     } catch(err) {
//         throw err;
//     }
// },