module.exports = (sequelize, type) => {
    const ProductName = sequelize.define('product_name', {
        name: {
            type: type.STRING,
            allowNull: false,
            unique:true
        }
    }, {
      underscored:true,
      timestamps:false
    });

    ProductName.associate = (models) => {
        ProductName.belongsTo(models.Product);
    };

    return ProductName;
}
