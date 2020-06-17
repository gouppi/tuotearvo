module.exports = (sequelize, type) => {
    const Brand = sequelize.define('brand', {
        id: {
          type: type.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        name: {
          type: type.STRING,
          unique: true
        }
        // TODO: alternatives array/json where e.g. 'Bang & Olufsen' could have 'B&O'

    }, {
      underscored:true
    });

    Brand.associate = (models) => {
      Brand.hasMany(models.Family);
      
    };

    return Brand;
}
