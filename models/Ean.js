module.exports = (sequelize, type) => {
    const Ean = sequelize.define('product_ean', {
        ean: {
            type: type.STRING,
            allowNull: false,
            unique:true
        }
    }, {
      underscored:true,
      timestamps:false
    });

    Ean.associate = (models) => {
        Ean.belongsTo(models.Product);
    };

    return Ean;
}
