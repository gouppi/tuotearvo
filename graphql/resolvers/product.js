
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
                    model: context.models.Variation,
                    include: {
                        model: context.models.Price
                    }
                },
                {
                    model: context.models.Category,
                },
                {
                    model: context.models.Brand
                },
                {
                    model: context.models.Review,
                    // TODO: limit 1 here of only the recent review text is needed!!!!
                    include: {
                        model: context.models.Variation,
                        
                    },
                    required: req
                },
            ],
            order: [
                ['reviews','reviewed_at','desc']
            ],
        });

        return products ? products : [];
    },
     productInfo: async (args,context,info) => {
        let whereQry = '';
        let replacements = {
            limit: args.limit ? args.limit : null,
            offset: args.offset ? args.offset : null
        };

        // Category id based filtering here
        if (args.categoryId) {
            whereQry = 'WHERE products.category_id IN (:categoryIds)';
            replacements.categoryIds = args.categoryId;
        }

        // Brand id based filtering here
        if (args.brandId) {
            whereQry += (whereQry ? ' AND ' : 'WHERE ') + 'products.brand_id IN (:brandId)';
            replacements.brandId = args.brandId;
        }



        let products = await context.models.sequelize.query(
            `SELECT products.id,
              products.model,
              products.image,
              count(reviews.id) AS reviews_count,
              ROUND(AVG(reviews.score), 1) AS average_score
            FROM products LEFT JOIN reviews ON (reviews.product_id = products.id) ${whereQry} GROUP BY products.id ORDER BY products.id LIMIT :limit OFFSET :offset `, 
              {
                type: QueryTypes.SELECT,
                replacements: replacements}
        );
        return products ? products : [];
     },

     productFilters: async (args,context,info) => {
        // TODO: args.brandId selected -> select only categories with corresponding brands in items
        // TODO: args.categoryID selected -> select only brands from products inside selected categories
        // TODO: count -> how many products in selected brand/category
        let categories = await context.models.Category.findAll();
        let brands = await context.models.Brand.findAll();

        return {
            categories: categories ? categories : [],
            brands: brands ? brands: []  
        };
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