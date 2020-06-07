
const test = require('ava');
//const helpers = require('../crawlers/helpers');
const {Brand} = require('../models/index');


test.serial('Database has no brands', async t => {
	let brandsCount = await Brand.count();
	t.falsy(brandsCount, "Database has no brands yet");
});

test.todo("Tähän testi kun haetaan brändiä");
test.todo("Tähän brandin luontitesti");
test.todo("Haetaan byt luotu brandi");
test.todo("Haetaan myös sillä ilike matchilla");