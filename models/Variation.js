module.exports = (sequelize, type) => {
    const Variation = sequelize.define('variation', {
        id: {
          type: type.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        ean:{
          type: type.STRING,
          unique:true
        },
        display_name:
        {
          type: type.STRING,
          unique:true
        },
        model_code: {
          type: type.STRING,
          unique:true
        },
        data:{
          type: type.JSONB
        }
    }, {
      underscored:true
    });

    Variation.associate = (models) => {
      Variation.belongsTo(models.Product);
      Variation.hasMany(models.Review);
      Variation.hasMany(models.Price);
      Variation.hasMany(models.VariationEan);
      Variation.hasMany(models.VariationModelCode);

    };

    return Variation;
}


