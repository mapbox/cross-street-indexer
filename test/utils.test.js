const {uniques2features} = require('../lib/utils');
const {test} = require('tap');

test('uniques2features', t => {
    const uniques = new Map();
    uniques.set('100!40', new Set([{foo: 'bar'}]));
    uniques.get('100!40').add({bar: 'foo'});

    const collection = uniques2features(uniques);
    t.true(collection.features.length === 2);
    t.end();
});
