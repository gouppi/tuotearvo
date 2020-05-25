const Sequelize = require('sequelize');
require('sequelize-hierarchy')(Sequelize);


var sequelize = new Sequelize(process.env.DB_DATABASE,'arvostelu','arvostelu', {
    host: 'localhost',
    dialect: 'postgres',
    logging:false
});

const models = {
    Brand: sequelize.import('./Brand'),
    Category: sequelize.import('./Category'),
    Product: sequelize.import('./Product'),
    Ean: sequelize.import('./Ean'),
    Mpn: sequelize.import('./Mpn'),
    Review: sequelize.import('./Review'),
    Price: sequelize.import('./Price'),
    Shop: sequelize.import('./Shop'),
};

Object.keys(models).forEach((modelName) => {
  if ('associate' in models[modelName]){
    models[modelName].associate(models);
  }

models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = models;
});
