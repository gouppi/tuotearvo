module.exports = (sequelize, type) => {
    const CategoryAlias = sequelize.define('category_alias', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        alias: {
            type: type.STRING,
            allowNull: false,
            unique: true
        }
    }, {
        underscored: true
    });

    CategoryAlias.associate = (models) => {
        CategoryAlias.belongsTo(models.Category);
    };

    return CategoryAlias;
}