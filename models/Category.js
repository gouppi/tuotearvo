module.exports = (sequelize, type) => {
    const Category = sequelize.define('category', {
        id: {
          type: type.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        parent_id: {
          type: type.INTEGER,
        },
        name: {
            type: type.STRING,
            allowNull: false,
            unique:true
        }
    }, {
      underscored:true
    });
    
    // TODO pitäis tehdä logiikka tänne.

    Category.associate = (models) => {
      Category.hasMany(models.Product);
    };

    return Category;
}
