const { QueryTypes, Op } = require("sequelize");

module.exports = {
  productReviews: async (args, context, info) => {},

  product: async (args, context, info) => {
    let product = await context.models.Product.findByPk(args.id, {
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
        // TODO: vois tarvita tuotekortille?
        //  {
        //   model: context.models.Brand
        // }
      ],
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

    let foo = product.reviews.length
      ? product.reviews.reduce((acc, r) => acc + r.rating, 0) /
        product.reviews.length
      : 0;
    product.rating_avg = parseFloat(foo).toFixed(2);
    return product;
  },

  productsForCategory: async (args, context, info) => {
    let whereCondition = {};
    if (args.id) {
      whereCondition = {
        id: args.id,
      };
    }

    let categoryWhere = {};
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
    // TODO: front page resolver needs only 1 possible review?
    // TODO2: DOES DISTINCT WORK HERE IN TOTAL COUNT AS WELL IF REVIEW IS SORTED BY DATE DESC LIMIT 1?
    // TODO: This resolver is used on front page and on product-page.
    // There might be cases when no reviews are found.
    let rows = await context.models.Product.findAll({
      where: whereCondition,
      limit: args.limit ? args.limit : null,
      offset: (page - 1) * args.limit,
      include: [
        {
          model: context.models.Review,
        },
        {
          model: context.models.Family,
        },
        {
          model: context.models.Category,
          where: categoryWhere,
        },
      ],

      order: [["reviews", "reviewed_at", "desc"]],
    });

    // TODO How to get review-association counts calculated to own key through Sequelize?
    rows = rows.map((product) => {
      product.reviews_count = product.reviews.length;
      let rating_avg =
        product.reviews.reduce((acc, review) => review.rating + acc, 0) /
        product.reviews.length;
      product.rating_avg = isNaN(rating_avg) ? 0 : rating_avg;
      //console.log("Rating average on", product.rating_avg);
      return product;
    });

    return {
      page: parseInt(page),
      total_pages: Math.ceil(count / args.limit),
      limit: parseInt(args.limit),
      count: count,
      products: rows,
    };

    // return products ? products : [];
  },

  categoryProducts: async (args, context, info) => {
    let products = await context.models.sequelize.query(`
        WITH RECURSIVE cats AS (
            SELECT id, name, parent_id FROM categories WHERE seo_name = 'lastentarvikkeet'
            UNION SELECT c2.id, c2.name, c2.parent_id FROM categories c2
            INNER JOIN cats c ON c.id = c2.parent_id)
        SELECT * FROM products WHERE category_id IN (SELECT cats.id FROM cats)`);

    let category = await context.models.Category.findOne({
      where: { seo_name: args.categorySeoName },
      include: {
        model: context.models.Category,
        as: "descendents",
        hierarchy: true,
      },
    });

    let ids = category.children.map((child) => {
      return child.id;
    });
    ids.push(category.id);
    // KategoriaIDt: [ 14, 15, 13 ] <- näillä voi hakea tuotteita, filtteröinnit yms.
    console.log("KategoriaIDt:", ids);
    return [];
  },

  productFilters: async (args, context, info) => {
    let categories = await context.models.Category.findAll({ hierarchy: true });
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
