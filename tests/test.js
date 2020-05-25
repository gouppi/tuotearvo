const test = require('ava');
const utils = require('../crawlers/utils');
const models = require('../models/index');

test.before("Initialize database", async t => {
	await models.sequelize.sync({force:true});
	let result = await models.sequelize.query('SELECT current_database()', {
		plain:true
	});

	t.is('arvostelu_test', result.current_database, "Correct database connected");
})

test.serial('Database has no products', async t => {
	let productsCount = await models.Product.count();
	t.falsy(productsCount, "Database has no products yet");
});

test.serial('Insert 1 new product', async t => {
	let P = await  models.Product.create({
		group_name: 'iPhone 11 Pro',
		name: 'Apple iPhone 11 Pro 256gb Space Gray',
		image: 'https://www.image.here',
		product_eans: [
		  {ean: '0000000123123'},
		  {ean: '0000000234234'},
		],
		product_mpns: [
		  {mpn: 'MX123'},
		  {mpn: 'MRT421'}
		]
	  }, {
		include: [models.Ean, models.Mpn]
	  });

	t.truthy(P.get('id'));
});

test.serial('Find product by data', async t => {
	let payload = {
        name_original: "Apple iPhone 11 Pro 256gb Space Gray",
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
              name:"Sony Mobile Communications",
              link:"http://www.sonymobile.com/global-en/"
        },
        mpns: ["MX123"],
        eans: ["0000000123123","0000000242424"],
        price: 369,
        external_id: "51649",
        product_page_link: "/fi/product/51649/nkfxc/Sony-Xperia-10-II-Android-puhelin-Dual-SIM-128-Gt-valkoinen",
        images: []
	  };

	  let products = await utils.findProducts(payload);
	  t.is(1, products.length, "Found 1 product with search query");
	  t.is("Apple iPhone 11 Pro 256gb Space Gray", products[0].get('name'));

	  payload.name_original = 'Foobar';
	  products = await utils.findProducts(payload);
	  t.is(1, products.length, "Found 1 product with search query, name removed");
	  t.is("Apple iPhone 11 Pro 256gb Space Gray", products[0].get('name'));

	  payload.eans = [];
	  products = await utils.findProducts(payload);
	  t.is(1, products.length, "Found 1 product with search query, name & eans removed");
	  t.is("Apple iPhone 11 Pro 256gb Space Gray", products[0].get('name'));

	  payload.mpns = [];
	  products = await utils.findProducts(payload);
	  t.is(0, products.length, "Removed all matching fields, no matches returned");

});

test.serial('Add another product', async t => {
	let P2 = await  models.Product.create({
		group_name: 'iPhone 11 Pro',
		name: 'Apple iPhone 11 Pro 256gb Tähtiharmaa',
		image: 'https://www.image.here',
		product_eans: [
		  {ean: '242424'},
		  {ean: '525255'},
		],
		product_mpns: [
		  {mpn: 'MX256'},
		  {mpn: 'MRT555'}
		]
	  }, {
		include: [models.Ean, models.Mpn]
	  });

	  t.truthy(P2.get('id'));
	  let count = await models.Product.count();
	  t.is(2, count, "Two products after second product insert");
});




