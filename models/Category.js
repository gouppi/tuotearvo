module.exports = (sequelize, type) => {
    const Category = sequelize.define('category', {
        id: {
          type: type.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        name: {
            type: type.STRING,
            allowNull: false,
            unique:true
        }
    }, {
      underscored:true
    });
    Category.isHierarchy();
    Category.associate = (models) => {
        Category.hasMany(models.Product);
    };

    return Category;
}
