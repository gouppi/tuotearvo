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
      where: { id: productIds},
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
    });

    console.log(products);


    return {
      count: meta.rowCount,
      products: products,
    };
  },
};
