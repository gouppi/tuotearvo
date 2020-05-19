const Sequelize = require('sequelize');
require('sequelize-hierarchy')(Sequelize);

var sequelize = new Sequelize('arvostelu','arvostelu','arvostelu', {
    host: 'localhost',
    dialect: 'postgres'
});

const models = {
    Brand: sequelize.import('./Brand'),
    Product: sequelize.import('./Product'),
    Variation: sequelize.import('./Variation'),
    Review: sequelize.import('./Review'),
    User: sequelize.import('./User'),
    Category: sequelize.import('./Category'),
};

Object.keys(models).forEach((modelName) => {
  if ('associate' in models[modelName]){
    models[modelName].associate(models);
  }

models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = models;
});
