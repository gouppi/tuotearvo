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
      origin: type.STRING,
      reviewedAt: {
        type: type.DATE,
        allowNull: false,
        defaultValue: sequelize.NOW
      }
  }, {
    underscored:true
  });

  Review.associate = (models) => {

    Review.belongsTo(models.Product);

  };

  return Review;
}