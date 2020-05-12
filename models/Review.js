module.exports = (sequelize, type) => {
  const Review = sequelize.define('review', {
      id: {
        type: type.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      text: type.STRING
  }, {
    underscored:true
  });

  Review.associate = (models) => {
    Review.belongsTo(models.Product);
    Review.belongsTo(models.User);
  };

  return Review;
}