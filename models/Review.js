module.exports = (sequelize, type) => {
  const Review = sequelize.define('review', {
      id: {
        type: type.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      ext_id: type.STRING,
      text: type.TEXT,
      title: type.STRING,
      score: type.INTEGER,
  }, {
    underscored:true
  });

  Review.associate = (models) => {
    Review.belongsTo(models.Variation);
    Review.belongsTo(models.Product);
    Review.belongsTo(models.User);
  };

  return Review;
}