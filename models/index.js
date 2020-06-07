const { Op, Sequelize} = require('sequelize');
require('sequelize-hierarchy')(Sequelize);
const sequelize = new Sequelize(process.env.DB_DATABASE,'arvostelu','arvostelu', {
    host: 'localhost',
    dialect: 'postgres',

  });


const models = {
  Category: sequelize.import('./Category'),
  CategoryAlias: sequelize.import('./CategoryAlias'),
  Ean: sequelize.import('./Ean'),
  Mpn: sequelize.import('./Mpn'),
  Product: sequelize.import('./Product'),
  Family: sequelize.import('./Family'),
  Brand: sequelize.import('./Brand'),
  Review: sequelize.import('./Review'),
  Price: sequelize.import('./Price'),
  Shop: sequelize.import('./Shop'),
};

Object.keys(models).forEach((modelName) => {
  if ('associate' in models[modelName]) {
    models[modelName].associate(models);
  }

  models.sequelize = sequelize;
  models.Sequelize = Sequelize;

  module.exports = { ...models };
});

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

  /**
   * Will merge given child products to master product.
   * @param {JSON} master the product to merge to
   * @param {Array} children all other products that will be merged
   * @returns {Model} New master model
   *
   */

  models.Product.mergeProducts = async function(master, children) {
    let eans,mpns = [];
    let names = [];

    children.map((c) => {
      if ('eans' in c && c.eans.length > 0) {
        eans = eans.concat(c.eans);
      }
      if ('mpns' in c && c.mpns.length > 0) {
        mpns = mpns.concat(c.mpns);
      }
      names.push(c.name);
    });


  models.Category.findCategory = async function(categories) {

  }






    // TODO: master tuotteeseen pitää yhdistää kaikkien lasten EAN-koodit
    // TODO: master tuotteeseen pitää yhdistää kaikkien lasten MPN-koodit
    // TODO: kaikkien lasten arvostelun product_id pitää vaihtaa masterin id:een
    // TODO: kaikkien lasten nimi pitää siirtää masterin productNameksi

  }
