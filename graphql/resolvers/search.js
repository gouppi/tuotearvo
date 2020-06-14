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
            SELECT p.*, c.name AS category_name, to_tsvector(p.name || ',' || string_agg(ean, ',') || ',' || string_agg(mpn, ',')) AS tsvector
            FROM products p
            JOIN categories c ON (c.id = p.category_id)
            JOIN product_eans pe ON (pe.product_id = p.id)
            JOIN product_mpns pm ON (pm.product_id = p.id)
            GROUP BY p.id, category_name)
        SELECT id,category_name FROM x WHERE x.tsvector @@ to_tsquery(:search) ORDER BY id`,
      { replacements: { search: search_params } }
    );

    // // TODO tee tämä loppuun
    // let order;
    // if (args.sort === "review") {
    //   order = [[context.models.sequelize.literal(`reviews_count DESC`)]];
    // }
    // // Uusimmat arvostelut
    // else if (args.sort === "latest") {
    //   order = [[context.models.sequelize.literal(`reviewedAt DESC`)]]/// TODO missing FROM-clause entry for table "reviews"
    // }
    // // name
    // else if (args.sort === "az") {
    //   order = [[context.models.sequelize.literal(`name ASC`)]]
    // }
    // else if (args.sort === "za") {
    //   order = [[context.models.sequelize.literal(`name DESC`)]]
    // }

    let page = args.page || 1;
    let limit = args.limit || 10;


    // TODO tässä tehdään sama reduce samalle resultsille kahdesti. Saako tuota vähä optimoitua?
    // TODO: jos haluaa sorttailla kategorian pohjalta, tarttee id:n mukaan myös.
    const productIds = results.slice(limit*(page-1),page*limit).reduce(
      (agg, product) => [...agg, product.id],
      []
    );
    let cats = results.reduce(
      (acc, obj) => (
        (acc[obj.category_name] = (acc[obj.category_name] || 0) + 1),
        acc
      ),
      {}
    );
    let categories = [];
    for (let [key, value] of Object.entries(cats)) {
      categories.push({ name: key, count: value });
    }

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
      ],
      order: [["reviews", "reviewed_at", "ASC"]],
    });

    return {
      count: meta.rowCount,
      page: page,
      total_pages: Math.ceil(meta.rowCount / limit),
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
