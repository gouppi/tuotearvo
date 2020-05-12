const Sequelize = require('sequelize');
//const ProductModel = require('./Product');
//const ReviewModel = require('./Review');

var sequelize = new Sequelize('arvostelu','arvostelu','arvostelu', {
    host: 'localhost',
    dialect: 'postgres'
});

const models = {
    Product: sequelize.import('./Product')
};

Object.keys(models).forEach((modelName) => {
  if ('associate' in models[modelName]){
    models[modelName].associate(models);
  }

models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = models;
});
