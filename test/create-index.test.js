const {test} = require('tap');
const {createIndex, splitUniques, normalizeNames} = require('../lib/create-index');

test('create-index', t => {
    const properties = new Set([{name: 'Abbot Ave'}, {name: 'Chester St'}]);
    const uniques = new Map([['-122.4!37.6', properties]]);
    const index = createIndex(uniques);

    t.equal(index.size, 8);
    t.true(index.has('abbot avenue+chester street'));
    t.true(index.has('abbot+chester'));
    t.true(index.has('abbot+chester street'));
    t.true(index.has('abbot avenue+chester'));
    t.true(index.has('chester street+abbot avenue'));
    t.true(index.has('chester+abbot'));
    t.true(index.has('chester+abbot avenue'));
    t.true(index.has('chester street+abbot'));
    t.end();
});

test('create-index - complex highways', t => {
    const properties = new Set([{name: 'Highway 200 North'}, {name: 'CA 130 West'}]);
    const uniques = new Map([['-122.4!37.6', properties]]);
    const index = createIndex(uniques);

    t.equal(index.size, 20);
    t.true(index.has('highway 200+ca 130'));
    t.true(index.has('200+130'));
    t.end();
});

test('create-index - dropped highways', t => {
    const properties = new Set([{name: 'Highway North'}, {name: 'CA West'}]);
    const uniques = new Map([['-122.4!37.6', properties]]);
    const index = createIndex(uniques);

    t.equal(index.size, 14);

    // True
    t.true(index.get('ca west+highway north'));
    t.true(index.get('ca west+highway'));
    t.true(index.get('ca+highway'));

    // False
    t.false(index.get('+'));
    t.false(index.get('+ca west'));
    t.end();
});

test('create-index - splitUniques', t => {
    const properties = new Set([{name: 'Foo Ave;Bar street'}, {name: 'Highway 130', ref: 'CA 130;HWY 130'}]);
    const uniques = new Map([['-122.4!37.6', properties]]);
    const names = splitUniques(uniques);
    const intersects = names.get('-122.4!37.6');

    t.equal(intersects.size, 5);
    t.true(intersects.has('Foo Ave'));
    t.true(intersects.has('Bar street'));
    t.true(intersects.has('Highway 130'));
    t.true(intersects.has('CA 130'));
    t.true(intersects.has('HWY 130'));
    t.end();
});

test('normalizeNames', t => {
    const names = new Set(['Foo Ave', 'Bar street', 'Highway 130', 'CA 130', 'HWY 130']);
    const uniqueNames = new Map([['-122.4!37.6', names]]);
    const normalizedNames = normalizeNames(uniqueNames);
    const intersects = normalizedNames.get('-122.4!37.6');

    t.equal(intersects.size, 4);
    t.true(intersects.has('foo avenue'));
    t.true(intersects.has('bar street'));
    t.true(intersects.has('highway 130'));
    t.true(intersects.has('ca 130'));
    t.end();
});

