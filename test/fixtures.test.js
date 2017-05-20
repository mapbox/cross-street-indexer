const path = require('path');
const load = require('load-json-file');
const {test} = require('tap');
const {hash} = require('../lib/utils');
const intersections = require('../lib/intersections');
const geocodingPairs = require('../lib/geocoding-pairs');

test('chester street+abbot avenue.geojson', t => {
    const geojson = load.sync(path.join(__dirname, 'fixtures', 'chester street+abbot avenue.geojson'));

    // Intersections
    const intersects = intersections(geojson.features);
    t.true(intersects.size = 1);
    t.true(intersects.get(hash([-122.4577111, 37.6885435])).size = 2);

    // Geocoding Pairs
    const pairs = geocodingPairs(intersects);
    t.true(pairs.size === 2);
    t.true(pairs.has('abbot avenue+chester street'));
    t.true(pairs.has('chester street+abbot avenue'));
    t.end();
});
