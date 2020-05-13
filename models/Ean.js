module.exports = (sequelize, type) => {
    const Ean = sequelize.define('ean', {
        id: {
          type: type.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        ean: type.STRING,
    }, {
      underscored:true
    });

    Ean.associate = (models) => {
      Ean.belongsTo(models.Product);
    };

    return Ean;
}
