// THIS FILE CONTAINS ALL CATEGORY MAPS FROM SEPARATE STORES.

const TELEVISIOT = 'Televisiot';
const PUHELIMET = 'Puhelimet';

const verkkokauppa = {
    '438b' : TELEVISIOT,
    '658b' : PUHELIMET,
}

const gigantti = {

}


const category_tree = {
    'Audio ja Hifi': {
        'Kuulokkeet': {},
        'Kaiuttimet': {},
        'Vahvistimet': {},
        'Kotiteatterit': {}
    },

    'Lastentarvikkeet': {
        'Vaunut ja rattaat': {},
        'Turvaistuimet': {},
        'Elektroniikka': {
            'Itkuhälyttimet': {},
            'Unikamerat': {},
            'Valaisimet': {}
        },
    },
    'TV ja video': {
        'Televisiot': {},
        'Projektorit': {},
    }
}


exports.category_maps = {
    ...verkkokauppa,
    ...gigantti
};


exports.category_tree = category_tree;