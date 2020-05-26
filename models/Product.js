module.exports = (sequelize, type) => {
	const Product = sequelize.define('product', {
		id: {
			type: type.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		group_name: {
			type: type.STRING,
			allowNull: false
		},
		name: {
			type: type.STRING,
			unique: true,
			allowNull: false
		},
		image: {
			type: type.STRING,
			unique: false,
			allowNull: true
		},
		fetch_data: {
			type: type.JSONB,
		}
	}, {
		underscored: true,
		paranoid: true
	});


	Product.associate = (models) => {
		Product.hasMany(models.Ean);
		Product.hasMany(models.Mpn);
		Product.hasMany(models.ProductName);
		Product.belongsTo(models.Brand);
		Product.belongsTo(models.Category);
	}

	return Product;
}

