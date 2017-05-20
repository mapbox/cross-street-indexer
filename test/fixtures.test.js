const path = require('path');
const load = require('load-json-file');
const {test} = require('tap');
const {hash} = require('../lib/utils');
const intersections = require('../lib/intersections');
const createIndex = require('../lib/create-index');

test('chester street+abbot avenue.geojson', t => {
    const geojson = load.sync(path.join(__dirname, 'fixtures', 'chester street+abbot avenue.geojson'));

    // Intersections
    const intersects = intersections(geojson.features);
    t.true(intersects.size = 1);
    t.true(intersects.get(hash([-122.4577111, 37.6885435])).size = 2);

    // Geocoding Pairs
    const index = createIndex(intersects);
    t.true(index.size === 2);
    t.true(index.has('abbot avenue+chester street'));
    t.true(index.has('chester street+abbot avenue'));
    t.end();
});
