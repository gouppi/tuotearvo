
const {Sequelize, Op} = require('sequelize');

module.exports = {
    search: async (args,context,info) => {
        let whereCondition = {};
        if (args.q) {
            whereCondition = {
                [Op.or]: [
                    {
                        model: {
                            [Op.iLike]:'%'+args.q+'%'
                        }
                    },
                    {
                        '$variations.ean$': {
                            [Op.like]:args.q+'%'
                        }
                    }
                ]
            }
        }

        let search = await context.models.Product.findAll({
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

        return search ? search : [];
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