module.exports = (sequelize, type) => {
    const User = sequelize.define('user', {
        id: {
          type: type.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        username: {
            type: type.STRING,
            allowNull: false
        },
        avatar: type.STRING,

    }, {
      underscored:true
    });

    User.associate = (models) => {
        User.hasMany(models.Review)
    };

    return User;
}