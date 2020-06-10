const { QueryTypes, Op } = require("sequelize");

module.exports = {
  product: async (args, context, info) => {
    let product = await context.models.Product.findByPk(args.id, {
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

    console.log("Product on ", product);

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
    //console.log(product.category.name);
    //console.log(product.category.seo_name);
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
    //console.log("Kategorian vanhemmat Array on:", parentCategoriesArray);
    product.parent_categories = parentCategoriesArray
      ? parentCategoriesArray
      : [];

    // let foo = product.reviews.length
    //   ? product.reviews.reduce((acc, r) => acc + r.rating, 0) /
    //     product.reviews.length
    //   : 0;
    // product.rating_avg = parseFloat(foo).toFixed(2);
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
