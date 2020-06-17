const { QueryTypes, Op } = require("sequelize");

module.exports = {
  search: async (args, context, info) => {
    // Tsvector search syntax here.
    // https://dba.stackexchange.com/questions/157951/get-partial-match-from-gin-indexed-tsvector-column
    const search_params = args.q
      .split(" ")
      .map((q) => q.concat(":*"))
      .join(" & ");

    let params = [search_params];

    // Prefilter all products with matching search query before loading them through Sequelize
    // TODO: categories & brands filtering incoming here.
    let where_category = "";
    let where_brand = "";

    if (args.filters.categories && args.filters.categories.length > 0) {
      where_category =
        " AND category_id IN (" +
        Array(args.filters.categories.length).fill("?").join() +
        ")";
      params = [...params, ...args.filters.categories];
    }
    if (args.filters.brands && args.filters.brands.length > 0) {
      where_brand = " AND brand_id IN (" + Array(args.filters.brands.length).fill("?").join() + ")";
      params = [...params, ...args.filters.brands];
    }

    const [results, meta] = await context.models.sequelize.query(
      `
      WITH x AS (
        SELECT p.*,
            c.name AS category_name,
            c.id AS xcategory_id,
            b.name AS brand_name,
            b.id AS brand_id,
            to_tsvector(
                p.name || ',' || string_agg(ean, ',') || ',' || string_agg(mpn, ',')
            ) AS tsvector
        FROM products p
            JOIN categories c ON (c.id = p.category_id)
            JOIN product_families pf ON (pf.id = p.product_family_id)
            JOIN brands b ON (b.id = pf.brand_id)
            JOIN product_eans pe ON (pe.product_id = p.id)
            JOIN product_mpns pm ON (pm.product_id = p.id)
        GROUP BY p.id,
            category_name,
            xcategory_id,
            brand_name,
            b.id
    )
    SELECT id,
        category_name,
        xcategory_id AS category_id,
        brand_name,
        brand_id

    FROM x
    WHERE x.tsvector @@ to_tsquery(?)
    ${where_category}
    ${where_brand}
    ORDER BY id`,
      { replacements: params }
    );

    // This looks awful, but it works. It calculates each category / brand counts to an object which contains ID,name and count for that particular object.
    // E.g. { id: 35, name: 'ProCaster', count: 30 }
    let productIds = [];
    let categories = {};
    let brands = {};
    let counter = { c: {}, b: {} };

    for (let i = 0; i < results.length; i++) {
      let r = results[i];
      productIds.push(r.id);
      counter.c[r.category_name] = (counter.c[r.category_name] || 0) + 1;
      counter.b[r.brand_name] = (counter.b[r.brand_name] || 0) + 1;
      categories[r.category_name] = {
        ...categories[r.category_name],
        id: r.category_id,
        name: r.category_name,
        count: counter.c[r.category_name],
        group: 'categories'
      };
      brands[r.brand_name] = {
        ...categories[r.brand_name],
        id: r.brand_id,
        name: r.brand_name,
        count: counter.b[r.brand_name],
        group: 'brands'
      };
    }

    let order = [["reviews", "reviewed_at", "ASC"]];
    if (args.sort === "review") {
      order = [
        [
          context.models.sequelize.literal(
            `family_reviews_count DESC, reviews_count DESC`
          ),
        ],
      ];
    }
    // TODO: This does not work yet
    else if (args.sort === "latest") {
      order = [[context.models.sequelize.literal(`reviewedAt DESC`)]]; /// TODO missing FROM-clause entry for table "reviews"
    }
    // name
    else if (args.sort === "az") {
      order = [[context.models.sequelize.literal(`name ASC`)]];
    } else if (args.sort === "za") {
      order = [[context.models.sequelize.literal(`name DESC`)]];
    }

    let limit = args.limit || 10;
    let offset = (args.page - 1 || 0) * limit;

    const products = await context.models.Product.findAll({
      attributes: {
        include: [
          [
            context.models.sequelize.literal(`(
                SELECT COUNT(*)::int FROM reviews where product_id = product.id)`),
            "reviews_count",
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
          model: context.models.Category,
        },
      ],
      order: order,
      limit: limit,
      offset: offset,
    });

    return {
      count: meta.rowCount,
      page: args.page,
      total_pages: Math.ceil(meta.rowCount / limit),
      products: products,
      filters: [
        {
          filter: "Kategoriat",
          values: Object.values(categories),
        },
        {
          filter: "Tuotemerkit",
          values: Object.values(brands),
        },
      ],
    };
  },
};
