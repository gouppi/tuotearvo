
const {QueryTypes} = require('sequelize');

module.exports = {
    recentReviews: async (args,context,info) => {

        // TODO: front page resolver needs only 1 possible review?

        // TODO: This resolver is used on front page and on product-page.
        // There might be cases when no reviews are found.
        let products = await context.models.Review.findAll({
            limit: 10,
            include: [
                {
                    model: context.models.Product,
                },
            ],
            order: [
                ['reviewed_at','desc']
            ],
        });

        return products ? products : [];
    }



}