module.exports = (sequelize, type) => {
    const Product = sequelize.define('product', {
        id: {
          type: type.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        image: type.STRING,
        model: type.STRING,
        
    }, {
      underscored:true
    });

    Product.associate = (models) => {
      Product.hasMany(models.Variation);
      Product.hasMany(models.Review);
      Product.belongsTo(models.Brand);
      Product.belongsTo(models.Category);
    };

  

    return Product;
}
