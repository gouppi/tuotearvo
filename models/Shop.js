module.exports = (sequelize, type) => {
    const Shop = sequelize.define('shop', {
        id: {
          type: type.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        name: {
            type: type.STRING,
            allowNull: false,
            unique:true
        },
        link: {
            type: type.STRING,
        // },
        // logo: {
        //     type: type.STRING,
         }
    }, {
      underscored:true
    });

    Shop.associate = (models) => {
        Shop.hasMany(models.Price);
        Shop.hasMany(models.Review);
    };

    return Shop;
}
