const test = require('tap').test;
const utils = require('../lib/utils');
const hash = utils.hash;
const index2json = utils.index2json;
const hash2coord = utils.hash2coord;
const uniques2features = utils.uniques2features;
const bbox2tiles = utils.bbox2tiles;

test('hash', t => {
    const coord = [100, 40];
    t.deepEqual(hash(coord), '100!40', 'hash');
    t.deepEqual(hash2coord(hash(coord)), coord, 'hash');
    t.end();
});

test('uniques2features', t => {
    const uniques = new Map();
    uniques.set('100!40', new Set([{foo: 'bar'}]));
    uniques.get('100!40').add({bar: 'foo'});

    const collection = uniques2features(uniques);
    t.true(collection.features.length === 2);
    t.end();
});

test('index2json', t => {
    const pairs = new Map([
        ['abbot avenue+chester street', [-122.4577111, 37.6885435]],
        ['chester street+abbot avenue', [-122.4577111, 37.6885435]]
    ]);
    const json = index2json(pairs);
    t.deepEqual(json['abbot avenue+chester street'], [-122.4577111, 37.6885435]);
    t.deepEqual(json['chester street+abbot avenue'], [-122.4577111, 37.6885435]);
    t.end();
});

test('bbox2tiles', t => {
    const bbox = [-122.5, 37.6, -122.1, 37.9];
    console.log(bbox2tiles(bbox).length);
    t.end();
});
