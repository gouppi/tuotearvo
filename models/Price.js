module.exports = (sequelize, type) => {
  const Price = sequelize.define(
    "prices",
    {
      price: {
        type: type.FLOAT,
      },
    },
    {
      underscored: true,
    },
  );

  Price.associate = (models) => {
    Price.belongsTo(models.Product);
    Price.belongsTo(models.Shop);
  };

  return Price;
};
