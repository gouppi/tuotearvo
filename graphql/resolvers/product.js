module.exports = {
    products: async (args,context,info) => {
        let products = await context.models.Product.findAll({
            include: [
                {
                    model: context.models.Review,
                    include: {
                        model: context.models.User
                    }
                },
                {
                    model: context.models.Ean
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