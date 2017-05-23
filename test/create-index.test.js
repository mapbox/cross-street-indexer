const test = require('tap').test;
const createIndex = require('../lib/create-index').createIndex;
const splitUniques = require('../lib/create-index').splitUniques;
const normalizeNames = require('../lib/create-index').normalizeNames;

test('create-index - create', t => {
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

test('create-index - create - complex highways', t => {
    const properties = new Set([{name: 'Highway 200 North'}, {name: 'CA 130 West'}]);
    const uniques = new Map([['-122.4!37.6', properties]]);
    const index = createIndex(uniques);

    t.equal(index.size, 20);
    t.true(index.has('highway 200+ca 130'));
    t.true(index.has('200+130'));
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

test('create-index - normalizeNames', t => {
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

