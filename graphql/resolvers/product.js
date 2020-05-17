
const Sequelize = require('sequelize');

module.exports = {
    products: async (args,context,info) => {
        let whereCondition = {};
        if (args.id) {
            whereCondition = {
                id: args.id
            }
        }

        let products = await context.models.Product.findAll({
            where: whereCondition,
            include: [
                {
                    model: context.models.Variation,
                },
                {
                    model: context.models.Brand
                },
                {
                    model: context.models.Review,
                    include: {
                        model: context.models.Variation
                    }
                }
            ]
        });

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