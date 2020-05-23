module.exports = (sequelize, type) => {
    const VariationEan = sequelize.define('variation_ean', {
        ean:{
          type: type.STRING,
          unique:true
        }
    }, {
      underscored:true
    });

    VariationEan.associate = (models) => {
        VariationEan.belongsTo(models.Variation);
    };

    return VariationEan;
}


