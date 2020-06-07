module.exports = (sequelize, type) => {
    const Mpn = sequelize.define('product_mpn', {
        mpn: {
            type: type.STRING,
            allowNull: false,
            unique:true
        }
    }, {
      underscored:true,
      timestamps:false
    });

    Mpn.associate = (models) => {
        Mpn.belongsTo(models.Product);
    };

    return Mpn;
}
