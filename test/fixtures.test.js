const path = require('path');
const load = require('load-json-file');
const test = require('tap').test;
const createIndex = require('../lib/create-index');
const intersections = require('../lib/intersections');

test('chester street+abbot avenue.geojson', t => {
    const geojson = load.sync(path.join(__dirname, 'fixtures', 'chester street+abbot avenue.geojson'));
    const intersects = intersections(geojson.features);
    const index = createIndex(intersects);

    t.equal(index.size, 2);
    t.true(index.has('abbot avenue+chester street'));
    t.true(index.has('chester street+abbot avenue'));
    t.end();
});
