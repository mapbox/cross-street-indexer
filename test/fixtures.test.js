const path = require('path');
const load = require('load-json-file');
const test = require('tap').test;
const createIndex = require('../lib/create-index').create;
const intersections = require('../lib/intersections');

test('chester street+abbot avenue.geojson', t => {
    const geojson = load.sync(path.join(__dirname, 'fixtures', 'chester street+abbot avenue.geojson'));
    const intersects = intersections(geojson.features);
    const index = createIndex(intersects);

    t.equal(index.size, 8);

    // True
    t.true(index.has('abbot avenue+chester street'));
    t.true(index.has('abbot+chester'));
    t.true(index.has('abbot+chester street'));
    t.true(index.has('abbot avenue+chester'));
    t.true(index.has('chester street+abbot avenue'));
    t.true(index.has('chester+abbot'));
    t.true(index.has('chester+abbot avenue'));
    t.true(index.has('chester street+abbot'));

    // False
    t.false(index.has('abbot avenue+abbot'));
    t.false(index.has('abbot+abbot avenue'));
    t.false(index.has('chester street+chester'));
    t.false(index.has('chester+chester street'));
    t.end();
});
