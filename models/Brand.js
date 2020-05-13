module.exports = (sequelize, type) => {
    const Brand = sequelize.define('brand', {
        id: {
          type: type.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        name: type.STRING,

    }, {
      underscored:true
    });

    Brand.associate = (models) => {
      Brand.hasMany(models.Product);
    };

    return Brand;
}
