const test = require('ava');
const {sequelize, Category} = require('../models/index');
const helpers = require('../crawlers/helpers')


test.todo("Tähän testi kun haetaan brändiä");

test.serial('Database has no categories', async t => {
	let count = await Category.count();
	t.falsy(count, "Database has no categories yet");
});

test.serial('Creating one category', async t => {
    let C = await Category.create({
        name: 'Puhelimet'
    });
    t.truthy(C.get('id'))
});

test.serial('Database has one category', async t => {
    let count = await Category.count();
	t.is(1,count, "Database has 1 category");
});

test.serial('Helper function to find category', async t => {
    let categories = [
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
    ];
    let C = await helpers.findCategory(categories);
    t.truthy(C, "Found actual category with listing")
    t.is(C.name, "Puhelimet", "Matches to puhelimet")
});

test.serial("Add another category to database", async t => {
    let C = await Category.create({
        name: 'GPS'
    });
    t.truthy(C.get('id'))
});

test.serial('Helper function to find category from last position', async t => {
    let categories = [
        {
            name: "GPS",
            id: "22a"
        },
        {
            name: "Älypuhliemt",
            id: "658b"
        },
        {
            name: "Android",
            id: "4793c"
        }
    ];
    let C = await helpers.findCategory(categories);
    t.truthy(C, "Found actual category with listing")
    t.is(C.name, "GPS", "Matches to puhelimet")
});

test.serial('Helper function does not find proper category', async t => {
    let categories = [
        {
            name: "Foo",
            id: "22a"
        },
        {
            name: "Faa",
            id: "658b"
        },
        {
            name: "Fii",
            id: "4793c"
        }
    ];
    let C = await helpers.findCategory(categories);
    t.falsy(C, "Didn't find actual category with Foo, Faa,Fii")
});

test.serial('Helper function with empty array', async t => {
    let C = await helpers.findCategory([]);
    t.falsy(C, "Empty array returns null")
})

test.serial('Helper function with null', async t => {
    let C = await helpers.findCategory(null);
    t.falsy(C, "Null returns null");
});

