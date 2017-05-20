const {uniques2features, index2json} = require('../lib/utils');
const {test} = require('tap');

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
