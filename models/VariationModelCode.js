module.exports = (sequelize, type) => {
    const VariationModelCode = sequelize.define('variation_model_code', {
        model_code:{
          type: type.STRING,
          unique:true
        }
    }, {
      underscored:true
    });

    VariationModelCode.associate = (models) => {
        VariationModelCode.belongsTo(models.Variation);
    };

    return VariationModelCode;
}


