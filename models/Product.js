module.exports = (sequelize, type) => {
    const Product = sequelize.define('product', {
        id: {
          type: type.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        name: type.STRING,
        image: type.STRING,

    }, {
      underscored:true
    });

    Product.associate = (models) => {
      Product.hasMany(models.Review);
    };

    return Product;
}