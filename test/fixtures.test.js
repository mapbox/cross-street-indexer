const path = require('path');
const load = require('load-json-file');
const {test} = require('tap');
const intersections = require('../lib/intersections');

test('chester street+abbot avenue.geojson', t => {
    const geojson = load.sync(path.join(__dirname, 'test', 'fixtures', 'chester street+abbot avenue.geojson'));
    const intersects = intersections(geojson.features);
    t.true(intersects.features.length > 0);
    t.end();
});
