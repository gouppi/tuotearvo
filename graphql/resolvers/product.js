const { QueryTypes, Op } = require("sequelize");

module.exports = {
  product: async (args, context, info) => {
    let product = await context.models.Product.findByPk(args.id, {
      include: [
        {
          model: context.models.Category,
        },
        {
          model: context.models.Review,
          include: [
            {
              model: context.models.Shop
            }
          ]
        },
        {
          model: context.models.Family,
          include: [
            {
              model: context.models.Review,
              include: [
                {
                  model: context.models.Shop
                },
                {
                  model: context.models.Product,
                  where: {
                    id: {
                      [Op.not]: args.id,
                    },
                  },
                  include: [context.models.Category],
                },
              ],
            },
          ],
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
              model: context.models.Shop,
            },
          ],
        },
      ],
      order: [["reviews", "reviewed_at", "DESC"]],
    });

    product.reviews_count = product.reviews.length;
    product.family_reviews_count = product.product_family.reviews.length;

    const rating_avg = product.reviews.reduce(
      (acc, review) => (acc += review.rating),
      0
    );
    product.rating_avg = rating_avg / product.reviews.length || 0;

    const family_rating_avg = product.product_family.reviews
      .filter((review) => review.product_id !== product.id)
      .reduce((acc, review) => (acc += review.rating), 0);
    product.family_rating_avg =
      family_rating_avg /
        product.product_family.reviews.filter(
          (r) => r.product_id !== product.id
        ).length || 0;

    // aggregate eans & mpns to single array for faster processing
    product.product_eans = product.product_eans.reduce(
      (acc, ean) => [...acc, ean.ean],
      []
    );
    product.product_mpns = product.product_mpns.reduce(
      (acc, mpn) => [...acc, mpn.mpn],
      []
    );

    let new_reviews = product.reviews || [];
    if (product.product_family && product.product_family.reviews) {
      new_reviews = new_reviews.concat(product.product_family.reviews);
    }

    product.reviews = new_reviews;

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
      order = [[context.models.sequelize.literal(`reviewedAt DESC`)]]; /// TODO missing FROM-clause entry for table "reviews"
    }
    // name
    else if (args.sort === "az") {
      order = [[context.models.sequelize.literal(`name ASC`)]];
    } else if (args.sort === "za") {
      order = [[context.models.sequelize.literal(`name DESC`)]];
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
      order: order,
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
