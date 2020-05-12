// module.exports = (sequelize, DataTypes) => {
//     const Review = sequelize.define('Review', {
//       id: {
//           type: DataTypes.INTEGER,
//           primaryKey:true,
//           autoIncrement:true
//       },
//       productId: DataTypes.INTEGER,
//       text: DataTypes.STRING
//     }, {});
//     Review.associate = function(models) {
//       Review.belongsTo(models.Product, {
//         foreignKey: 'productId',
//         as: 'product',
//         onDelete: 'CASCADE',
//       })
//     };
//     return Review;
//   };
  
  // database/models/post.js

module.exports = (sequelize, type, Product) => {
    return sequelize.define('review', {
        id: {
          type: type.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        product_id: {
           type: type.INTEGER,
           references: {
                model: Product,
                

           } 
        },
        comment: type.STRING
    })
}