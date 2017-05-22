const test = require('tap').test;
const createIndex = require('../lib/create-index');

test('create-index', t => {
    const properties = new Set([{name: 'abbot avenue'}, {name: 'chester street'}]);
    const uniques = new Map([['-122.4577111!37.6885435', properties]]);

    t.equal(createIndex(uniques).size, 2, 'standard');
    t.end();
});

test('create-index - split refs & names', t => {
    const properties = new Set([{name: 'abbot avenue;foo street'}, {name: 'chester street', ref: 'CA 130;HWY 130'}]);
    const uniques = new Map([['-122.4577111!37.6885435', properties]]);

    t.equal(createIndex(uniques).size, 20);
    t.end();
});
