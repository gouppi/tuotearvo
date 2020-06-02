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
        },
      ],
    });

    // Assigning parent_categories hierarchy directly to parent so product card can have hierarchy links to individual categories.
    let parentCategories = await product.category.getAncestors();
    console.log(product.category.name);
    console.log(product.category.seo_name);
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

    return product;
  },

  products: async (args, context, info) => {
      console.log("Products resolverin products lohko");
    let whereCondition = {};
    if (args.id) {
      whereCondition = {
        id: args.id,
      };
    }

    let categoryWhere = {};
    if (args.categorySeoName) {
        let cat_ids = await context.models.sequelize.query(`
        WITH RECURSIVE cats AS (
            SELECT id, name, parent_id FROM categories WHERE seo_name = :seo_name
            UNION SELECT c2.id, c2.name, c2.parent_id FROM categories c2
            INNER JOIN cats c ON c.id = c2.parent_id)
        SELECT cats.id FROM cats`, {replacements: {seo_name: args.categorySeoName}, type: context.models.sequelize.QueryTypes.SELECT});
     let values = cat_ids.map(cat_id => cat_id.id);
      categoryWhere = { id: {[Op.in]: values }};
    }

    // TODO: front page resolver needs only 1 possible review?
    // TODO: This resolver is used on front page and on product-page.
    // There might be cases when no reviews are found.
    let products = await context.models.Product.findAll({
      where: whereCondition,
      limit: args.limit ? args.limit : null,
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
    products = products.map((product) => {
      product.reviews_count = product.reviews.length;
      let rating_avg =
        product.reviews.reduce((acc, review) => review.rating + acc, 0) /
        product.reviews.length;
      product.rating_avg = isNaN(rating_avg) ? 0 : rating_avg;
      //console.log("Rating average on", product.rating_avg);
      return product;
    });

    return products ? products : [];
  },

  // TODO: haluan että kategorian lapsikategorioistakin otetaan tuotteet huomioon tuotelistauksessa.

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
};
