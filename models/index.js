const Sequelize = require('sequelize');

var sequelize = new Sequelize('arvostelu','arvostelu','arvostelu', {
    host: 'localhost',
    dialect: 'postgres'
});

const models = {
    Product: sequelize.import('./Product'),
    Review: sequelize.import('./Review'),
    User: sequelize.import('./User'),
};

Object.keys(models).forEach((modelName) => {
  if ('associate' in models[modelName]){
    models[modelName].associate(models);
  }

models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = models;
});
