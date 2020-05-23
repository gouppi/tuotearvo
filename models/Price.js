module.exports = (sequelize, type) => {
  const Price = sequelize.define(
    "prices",
    {
      price: {
        type: type.FLOAT,
      },
      variation_id: {
          type: type.INTEGER,
          allowNull: false
      },
      shop_id: {
          type: type.INTEGER,
          allowNull: false
      }
    },
    {
      underscored: true,
    },
    {
      indexes: [
        {
          unique: true,
          fields: ["variation_id", "shop_id"],
        },
      ],
    }
  );

  Price.associate = (models) => {
    Price.belongsTo(models.Variation);
    Price.belongsTo(models.Shop);
  };

  return Price;
};
