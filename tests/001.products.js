const test = require('ava');
const {sequelize, Product, Ean, Mpn} = require('../models/index');


/**
 * This test is run before any other test.
 */
test.before("Initialize database", async t => {
	await sequelize.sync({ force: true });
	let result = await sequelize.query('SELECT current_database()', {
		plain: true
	});

	t.is('arvostelu_test', result.current_database, "Correct database connected");
})

test.serial('Database has no products', async t => {
	let productsCount = await Product.count();
	t.falsy(productsCount, "Database has no products yet");
});

test.serial("product fetchProducts for 0 products", async t => {
	let products = await Product.findProducts([]);
	t.deepEqual([], products);
});

test.serial('Insert 1 new product', async t => {
	let P = await Product.create({
		group_name: 'iPhone 11 Pro',
		name: 'Apple iPhone 11 Pro 256gb Space Gray',
		image: 'https://www.image.here',
		product_eans: [
			{ ean: '0000000123123' },
			{ ean: '0000000234234' },
		],
		product_mpns: [
			{ mpn: 'MX123' },
			{ mpn: 'MRT421' }
		]
	}, {
		include: [Ean, Mpn]
	});

	t.truthy(P.get('id'));
});

test.serial('Find product by data', async t => {
	let payload = {
		name: "Apple iPhone 11 Pro 256gb Space Gray",
		name_parsed: "iPhone 11 Pro",
		category: {
			id: "4793c",
			name: "Android",
			path: [
				{
					name: "Puhelimet",
					id: "22a"
				},
				{
					name: "Puhelimet",
					id: "658b"
				},
				{
					name: "Android",
					id: "4793c"
				}
			]
		},
		brand: {
			name: "Sony Mobile Communications",
			link: "http://www.sonymobile.com/global-en/"
		},
		mpns: ["MX123"],
		eans: ["0000000123123", "0000000242424"],
		price: 369,
		external_id: "51649",
		product_page_link: "/fi/product/51649/nkfxc/Sony-Xperia-10-II-Android-puhelin-Dual-SIM-128-Gt-valkoinen",
		images: []
	};
	let products = await Product.findProducts(payload);
	t.is(1, products.length, "Found 1 product with search query");
	t.is("Apple iPhone 11 Pro 256gb Space Gray", products[0].get('name'));

	payload.name = 'Foobar';
	products = await Product.findProducts(payload);
	t.is(1, products.length, "Found 1 product with search query, name removed");
	t.is("Apple iPhone 11 Pro 256gb Space Gray", products[0].get('name'));

	payload.eans = [];
	products = await Product.findProducts(payload);
	t.is(1, products.length, "Found 1 product with search query, name & eans removed");
	t.is("Apple iPhone 11 Pro 256gb Space Gray", products[0].get('name'));

	payload.mpns = [];
	products = await Product.findProducts(payload);
	t.is(0, products.length, "Removed all matching fields, no matches returned");
});

test.serial('Add another product', async t => {
	let P2 = await Product.create({
		group_name: 'iPhone 11 Pro',
		name: 'Apple iPhone 11 Pro 256gb Tähtiharmaa',
		image: 'https://www.image.here',
		product_eans: [
			{ ean: '0000000242424' },
			{ ean: '0000000525255' },
		],
		product_mpns: [
			{ mpn: 'MX256' },
			{ mpn: 'MRT555' }
		]
	}, {
		include: [Ean, Mpn]
	});

	t.truthy(P2.get('id'));
	let count = await Product.count();
	t.is(2, count, "Two products after second product insert");
});

test.serial('Find products by data', async t => {
	let count = await Product.count();
	t.is(2, count, "Two products after second product insert");
	let payload = {
		name: "",
		name_parsed: "iPhone 11 Pro",
		category: {
			id: "4793c",
			name: "Android",
			path: [
				{
					name: "Puhelimet",
					id: "22a"
				},
				{
					name: "Puhelimet",
					id: "658b"
				},
				{
					name: "Android",
					id: "4793c"
				}
			]
		},
		brand: {
			name: "Sony Mobile Communications",
			link: "http://www.sonymobile.com/global-en/"
		},
		mpns: [],
		eans: [],
		price: 369,
		external_id: "51649",
		product_page_link: "/fi/product/51649/nkfxc/Sony-Xperia-10-II-Android-puhelin-Dual-SIM-128-Gt-valkoinen",
		images: []
	};

	let products = await Product.findProducts(payload);
	t.is(0, products.length);

	payload.mpns = ["MX256"];
	products = await Product.findProducts(payload);
	t.is(1, products.length);
	t.is(products[0].get("name"), "Apple iPhone 11 Pro 256gb Tähtiharmaa");

	payload.mpns = ["MX256", "MX123"];
	products = await Product.findProducts(payload);
	t.is(2, products.length);
	t.is(products[0].get("name"), "Apple iPhone 11 Pro 256gb Space Gray")
	t.is(products[1].get("name"), "Apple iPhone 11 Pro 256gb Tähtiharmaa");

	// This match now uses name to one product and mpn for another
	payload.mpns = [];
	payload.eans = ["0000000242424"];
	products = await Product.findProducts(payload);
	t.is(1, products.length);
	t.is(products[0].get("name"), "Apple iPhone 11 Pro 256gb Tähtiharmaa");

	payload.eans = ["0000000234234"];
	payload.mpns = ["MX256"];
	products = await Product.findProducts(payload);
	t.is(2, products.length);
	t.is(products[0].get("name"), "Apple iPhone 11 Pro 256gb Space Gray")
	t.is(products[1].get("name"), "Apple iPhone 11 Pro 256gb Tähtiharmaa");
});


test.serial('Try to find with mismatching data', async t => {
	let payload = {
		name: "Foobar",
		mpns: ["123123123123123"],
		eans: ["123123123123123"],
		price: 369,
		external_id: "51649",
		product_page_link: "/fi/product/51649/nkfxc/Sony-Xperia-10-II-Android-puhelin-Dual-SIM-128-Gt-valkoinen",
		images: []
	};

	let products = await Product.findProducts(payload);
	t.falsy(products.length)
});