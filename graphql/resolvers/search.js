const { QueryTypes, Op } = require("sequelize");

module.exports = {
  search: async (args, context, info) => {
    const search_params = args.q
      .split(" ")
      .map((q) => q.concat(":*"))
      .join(" & ");
    // Tänne tulee monta hakusanaa parhaimmillaan. trimmataan se sopivaksi tsvektoriin wildcardilla.
    // https://dba.stackexchange.com/questions/157951/get-partial-match-from-gin-indexed-tsvector-column

    const [results, meta] = await context.models.sequelize.query(
      `
        WITH x AS (
            SELECT p.*, to_tsvector(name || ',' || string_agg(ean, ',') || ',' || string_agg(mpn, ',')) AS tsvector
            FROM products p
            JOIN product_eans pe ON (pe.product_id = p.id)
            JOIN product_mpns pm ON (pm.product_id = p.id)
            GROUP BY p.id)
        SELECT id FROM x WHERE x.tsvector @@ to_tsquery(:search)`,
      { replacements: { search: search_params } }
    );

    const productIds = results.reduce(
      (agg, product) => [...agg, product.id],
      []
    );
    const products = await context.models.Product.findAll({
      attributes: {
        // TODO: tämä hakee nyt oikein tuotteiden määrän, mutta family_id pitäis olla se linkkaava tekijä näissä muutenkin.
        // TODO: On vaikea yhdistää tuo suoraan product - taulun alle. Voiko sequelizella edes?
        include: [
          [
            context.models.sequelize.literal(`(
                SELECT COUNT(*)::int FROM reviews where product_id = product.id)`),
            "reviews_count", // TODO fix this line, not able to set reviewsCount under product alias
          ],
          [
            context.models.sequelize.literal(`(
              SELECT COUNT(*)::int FROM reviews WHERE product_family_id = product.product_family_id)`),
              "family_reviews_count",
          ],
          [
            context.models.sequelize.literal(`(
            SELECT AVG(rating) FROM reviews WHERE product_family_id = product.product_family_id)`),
            "family_rating_avg",
          ],
          [
            context.models.sequelize.literal(`(
                SELECT AVG(rating) FROM reviews WHERE product_id = product.id
                )`),
            "rating_avg",
          ],
        ],
      },
      where: { id: productIds },
      include: [
        {
          model: context.models.Review,
        },
        {
          model: context.models.Family,
        },
        {
          model: context.models.Category,
        },
        {
          model: context.models.Price,
          include: [
            {
              model: context.models.Shop,
            },
          ],
        },
      ],
      order: [["reviews", "reviewed_at", "ASC"]],
    });

    console.log(products);

    // get all categories and count occurrences of search matches to these categories.
    var result = products.reduce(
      (acc, product) => (
        (acc[product.category.name] = (acc[product.category.name] || 0) + 1),
        acc
      ),
      {}
    );

    let categories = [];
    for (let [key, value] of Object.entries(result)) {
      categories.push({ name: key, count: value });
    }

    return {
      count: meta.rowCount,
      products: products,
      filters: [
        {
          filter: "Kategoriat",
          values: categories
        },
      ],
    };
  },
};
