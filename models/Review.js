module.exports = (sequelize, type) => {
  const Review = sequelize.define(
    "review",
    {
      id: {
        type: type.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      external_id: {
        type: type.STRING,
        allowNull: false,
        unique: true,
      },
      text: type.TEXT,
      title: type.STRING,
      recommends: type.BOOLEAN,
      rating: type.INTEGER,
      //origin: type.STRING,
      reviewedAt: {
        type: type.DATE,
        allowNull: false,
        defaultValue: type.NOW,
      },
      fetch_data: type.JSONB,
    },
    {
      underscored: true,
    }
  );

  Review.associate = (models) => {
    // Review.belongsTo(models.Product, {
    //   onDelete: "CASCADE",
    //   as: "product_reviews",
    //   sourceKey: "id",
    //   foreignKey: "product_id",
    // });
    // Review.belongsTo(models.Product, {
    //   onDelete: "CASCADE",
    //   as: "family_reviews",
    //   sourceKey: "product_family_id",
    //   foreignKey: "family_id",
    // });
    Review.belongsTo(models.Product, {onDelete:'CASCADE'});
    Review.belongsTo(models.Family);
    Review.belongsTo(models.Shop);
  };

  return Review;
};
