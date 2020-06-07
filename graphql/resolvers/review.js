module.exports = {
  recentReviews: async (args, context, info) => {
    let products = await context.models.Review.findAll({
      limit: 10,
      include: [
        {
          model: context.models.Product,
          include: [
            {
              model: context.models.Category,
            },
          ],
        },
      ],
      order: [["reviewed_at", "desc"]],
    });

    return products ? products : [];
  },
};
