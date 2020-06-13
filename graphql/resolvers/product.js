const { QueryTypes, Op } = require("sequelize");

module.exports = {
  product: async (args, context, info) => {
    let product = await context.models.Product.findByPk(args.id, {
      attributes: {
        /**
         *          SubPlan 2
           ->  Aggregate  (cost=3490.24..3490.26 rows=1 width=4) (actual time=4.109..4.116 rows=1 loops=112)
                 ->  Seq Scan on reviews reviews_2  (cost=0.00..3490.21 rows=13 width=0) (actual time=0.299..3.575 rows=75 loops=112)
                       Filter: (product_family_id = product.product_family_id)
                       Rows Removed by Filter: 9062
         SubPlan 3
           ->  Aggregate  (cost=3490.25..3490.26 rows=1 width=32) (actual time=4.144..4.150 rows=1 loops=112)
                 ->  Seq Scan on reviews reviews_3  (cost=0.00..3490.21 rows=13 width=4) (actual time=0.292..3.601 rows=75 loops=112)
                       Filter: (product_family_id = product.product_family_id)
                       Rows Removed by Filter: 9062

            TÄNNE TARTTEE INDEKSIT KYLLÄ!!!
         */
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

      include: [
        {
          model: context.models.Category,
        },
        {
          model: context.models.Review,
        },
        {
          model: context.models.Ean,
        },
        {
          model: context.models.Mpn,
        },
        {
          model: context.models.Price,
          include: [
            {
              model: context.models.Shop
            }
          ]
        }
      ],
      order: [["reviews","reviewed_at", "DESC"]]
    });


    // aggregate eans & mpns to single array for faster processing
    product.product_eans = product.product_eans.reduce(
      (acc, ean) => [...acc, ean.ean],
      []
    );
    product.product_mpns = product.product_mpns.reduce(
      (acc, mpn) => [...acc, mpn.mpn],
      []
    );

    // Assigning parent_categories hierarchy directly to parent so product card can have hierarchy links to individual categories.
    let parentCategories = await product.category.getAncestors();
    let parentCategoriesArray = parentCategories.map((parentCategory) => ({
      seo_name: parentCategory.seo_name,
      name: parentCategory.name,
    }));
    parentCategoriesArray = Array.isArray(parentCategoriesArray)
      ? parentCategoriesArray
      : [];

    parentCategoriesArray.push({
      name: product.category.name,
      seo_name: product.category.seo_name,
    });
    product.parent_categories = parentCategoriesArray
      ? parentCategoriesArray
      : [];

    return product;
  },

  productsForCategory: async (args, context, info) => {
    let categoryWhere = {};

    let order = null;

    console.log("sort", args);

    // arvostelluimmat
    if (args.sort === "review") {
      order = [[context.models.sequelize.literal(`reviews_count DESC`)]];
    }
    // Uusimmat arvostelut
    else if (args.sort === "latest") {
      order = [[context.models.sequelize.literal(`reviewedAt DESC`)]]/// TODO missing FROM-clause entry for table "reviews"
    }
    // name
    else if (args.sort === "az") {
      order = [[context.models.sequelize.literal(`name ASC`)]]
    }
    else if (args.sort === "za") {
      order = [[context.models.sequelize.literal(`name DESC`)]]
    }

    if (args.categorySeoName) {
      let cat_ids = await context.models.sequelize.query(
        `
        WITH RECURSIVE cats AS (
            SELECT id, name, parent_id FROM categories WHERE seo_name = :seo_name
            UNION SELECT c2.id, c2.name, c2.parent_id FROM categories c2
            INNER JOIN cats c ON c.id = c2.parent_id)
        SELECT cats.id FROM cats`,
        {
          replacements: { seo_name: args.categorySeoName },
          type: context.models.sequelize.QueryTypes.SELECT,
        }
      );
      let values = cat_ids.map((cat_id) => cat_id.id);
      categoryWhere = { id: { [Op.in]: values } };
    }

    // Get total count of products inside given categories. Doesn't work directly in main query, returns all review-items as well.
    let count = await context.models.Product.count({
      include: [
        {
          model: context.models.Category,
          where: categoryWhere,
        },
      ],
    });

    let page = args.page ? args.page : 1;
    let rows = await context.models.Product.findAll({
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
            SELECT AVG(rating) FROM reviews WHERE product_id = product.id
            )`),
            "rating_avg",
          ],
        ],
      },
      limit: args.limit ? args.limit : null,
      offset: (page - 1) * args.limit,
      include: [
        {
          model: context.models.Family,
        },
        {
          model: context.models.Category,
          where: categoryWhere,
        },
      ],
      order: order
    });

    return {
      page: parseInt(page),
      total_pages: Math.ceil(count / args.limit),
      limit: parseInt(args.limit),
      count: count,
      products: rows,
    };
  },

  titleInfo: async (args, context, info) => {
    let product_count = await context.models.sequelize.query(
      "SELECT count(*) FROM products WHERE deleted_at IS NULL",
      { type: QueryTypes.SELECT, raw: true, plain: true }
    );
    let review_count = await context.models.sequelize.query(
      "SELECT count(*) FROM reviews ",
      { type: QueryTypes.SELECT, raw: true, plain: true }
    );
    return {
      product_count: parseInt(product_count.count),
      review_count: parseInt(review_count.count),
    };
  },
};
