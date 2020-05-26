const { Sequelize, Op } = require('sequelize');
require('sequelize-hierarchy')(Sequelize);
const sequelize = new Sequelize(process.env.DB_DATABASE,'arvostelu','arvostelu', {
  host: 'localhost',
  dialect: 'postgres',
  logging: false
});

/**
 * @property {JSON} models
 * @property {Product} Product
 */
const models = {

  Category: sequelize.import('./Category'),
  Ean: sequelize.import('./Ean'),
  Mpn: sequelize.import('./Mpn'),
  Product: sequelize.import('./Product'),
  ProductName: sequelize.import('./ProductName'),
  Brand: sequelize.import('./Brand'),
  Review: sequelize.import('./Review'),
  Price: sequelize.import('./Price'),
  Shop: sequelize.import('./Shop'),
};

Object.keys(models).forEach((modelName) => {
  if ('associate' in models[modelName]) {
    models[modelName].associate(models);
  }

  /**
   * Tries to find all products with given name, ean-codes and model numbers.
   * @returns {Array}
   */
  models.Product.findProducts = async function(product) {
    try {
      let params = [];
      if ('name' in product) {
        params.push({name: product.name});
      }

      if ('eans' in product && product.eans.length) {
        let res = product.eans.map((ean) => ({ '$product_eans.ean$': ean.padStart(13, '0') }));
        params = params.concat(res);
      }

      if ('mpns' in product && product.mpns.length) {
        let res = product.mpns.map(mpn => ({ '$product_mpns.mpn$': mpn }));
        params = params.concat(res);
      }

      let P = await models.Product.findAll({
        where: {
          [Op.or]: params
        },
        include: [
          { model: models.Ean, as: models.Ean.tableName },
          { model: models.Mpn, as: models.Mpn.tableName }
        ],
        order: [
          ['id', 'ASC']
        ]
      });
      return P;
    } catch (err) {
      console.log(err);
    }
    return [];
  }

  models.sequelize = sequelize;
  models.Sequelize = Sequelize;

  module.exports = { ...models };
});

