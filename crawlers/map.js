// THIS FILE CONTAINS ALL CATEGORY MAPS FROM SEPARATE STORES.

const TELEVISIOT = 'Televisiot';
const PUHELIMET = 'Puhelimet';

const verkkokauppa = {
    '438b' : TELEVISIOT,
    '658b' : PUHELIMET,
}

const gigantti = {

}


exports.category_maps = {
    ...verkkokauppa,
    ...gigantti
};