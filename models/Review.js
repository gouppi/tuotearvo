module.exports = (sequelize, type) => {
  const Review = sequelize.define('review', {
      id: {
        type: type.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      external_id: {
        type: type.STRING,
        allowNull: false,
        unique: true
      },
      text: type.TEXT,
      title: type.STRING,
      recommends: type.BOOLEAN,
      rating: type.INTEGER,
      origin: type.STRING,
      reviewedAt: {
        type: type.DATE,
        allowNull: false,
        defaultValue: type.NOW
      },
      fetch_data: type.JSONB
  }, {
    indexes: [
      {
        fields: ['product_id']
      },
    ],
    underscored:true
  });

  Review.associate = (models) => {
    Review.belongsTo(models.Product);
    //Review.belongsTo(models.Family);
  };

  return Review;
}