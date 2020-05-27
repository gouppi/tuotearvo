const test = require('ava');
const {sequelize, Product, Ean, Mpn, Review} = require('../models/index');
const P = require('../models/Product');

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


test.serial('Clear database data from existing products and insert two new', async t => {
	await Product.truncate({cascade:true});
	let count = await Product.count();
	t.is(0, count, "Zero products after truncate");

	let P1 = await Product.create({
		group_name: 'iPhone 11 Pro',
		name: 'Apple iPhone 11 Pro 64 Gt -puhelin, tähtiharmaa, MWC22',
		image: 'https://www.image.here',
		product_eans: [
			{ ean: '0190199388536' },
		],
		product_mpns: [
			{ mpn: 'MWC22FS/A' },
		]
	}, {
		include: [Ean, Mpn]
	});

	t.truthy(P1.get('id'));

	let P2 = await Product.create({
		group_name: 'iPhone 11 Pro',
		name: 'Apple iPhone 11 Pro 64 Gt -puhelin, space gray, MWC22',
		image: 'https://www.image.here',
		product_eans: [
			{ ean: '0190199388529' },
		],
		product_mpns: [
			{ mpn: 'MWC22QN/A' },
		]
	}, {
		include: [Ean, Mpn]
	});

	t.truthy(P2.get('id'));
	count = await Product.count();
	t.is(2, count);

	let R1 = await Review.create({
		ext_id: '123123',
		text: "Tämä on erittäin hyvä puhelin ja tykkään nimestä tähtiharmaa",
		title:"Erittäin onnellinen iPhone-omistaja",
		score: 5,
		origin: "Testi.test",
	});
	await P2.addReview(R1);

	count = await Review.count({where: {product_id: P2.get('id')}})
	t.is(1, count);

});


// test.serial("Merging two existing products with overlapping EANS", async t => {

// 	let products = await Product.findProducts({eans: ["0190199388529", "0190199388536"] })
// 	t.is(2, products.length)
// 	t.is("Apple iPhone 11 Pro 64 Gt -puhelin, tähtiharmaa, MWC22", products[0].name)
// 	t.is("Apple iPhone 11 Pro 64 Gt -puhelin, space gray, MWC22", products[1].name)

// 	let merged = await Product.mergeProducts(products.shift(), products);
// 	t.is("Apple iPhone 11 Pro 64 Gt -puhelin, tähtiharmaa, MWC22", merged.name);
// 	t.truthy(merged.additional_names.includes("Apple iPhone 11 Pro 64 Gt -puhelin, space gray, MWC22"));

// });