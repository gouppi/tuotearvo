module.exports = (sequelize, type) => {
    const Family = sequelize.define('product_family', {
                name: {
            type: type.STRING,
            unique:true,
            allowNull:false,
        },
        id: {
			type: type.INTEGER,
			primaryKey: true,
			autoIncrement: true
        },

        image: {
            type: type.STRING
        }
    }, {
      underscored:true,
      timestamps:false
    });

    Family.associate = (models) => {
        Family.hasMany(models.Product);
        Family.belongsTo(models.Brand);
		Family.belongsTo(models.Category);
    };

    return Family;
}
