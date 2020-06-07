
const {QueryTypes} = require('sequelize');

module.exports = {
    families: async (args,context,info) => {
        let where = {}
        console.log("Families");
        let families = await context.models.Family.findAll({
            limit: args.limit ? args.limit : null,
            offset: args.offset ? args.offset :null,
            include: [
                {
                    model: context.models.Category,
                },
                {
                    model: context.models.Brand
                },
                {
                    model: context.models.Product,
                },
            ],
            order: [
                ['name', 'ASC']
            ]
        });

        return families ? families : [];
    }
}