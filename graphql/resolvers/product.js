module.exports = {
    products: async (args,context,info) => {
        let products = await context.models.Product.findAll({
            include: context.models.Review
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