module.exports = (sequelize, type) => {
    const Product = sequelize.define('product', {
        id: {
          type: type.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        name: type.STRING, 
    }, {
      underscored:true
    });

    Product.associate = (models) => {};

    return Product;
}