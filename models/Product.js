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
		reviews_count: type.VIRTUAL,
		rating_avg: type.VIRTUAL,
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
		Product.belongsTo(models.Family);
		Product.hasMany(models.Ean);
		Product.hasMany(models.Mpn);
		Product.belongsTo(models.Category);
		Product.hasMany(models.Price);
		Product.hasMany(models.Review);
	}

	return Product;
}

