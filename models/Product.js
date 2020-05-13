module.exports = (sequelize, type) => {
    const Product = sequelize.define('product', {
        id: {
          type: type.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        image: type.STRING,
        model: type.STRING,
        model_code: type.STRING,

    }, {
      underscored:true
    });

    Product.associate = (models) => {
      Product.hasMany(models.Review);
      Product.hasMany(models.Ean);
      Product.belongsTo(models.Brand);
    };

  

    return Product;
}


// Product
// id serial
// name varchar
// brand_id INTEGER
// model varchar
// model_id varchar

// product_eans 
// id serial
// product_id INTEGER
// ean VARCHAR

// product_reviews
// id serial
// product_id INTEGER
// user_id INTEGER
// text VARCHAR
// rating FLOAT


// User
// id serial
// name varchar
// avatar varchar


// Brand
// id
// name




