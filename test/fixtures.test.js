const path = require('path');
const load = require('load-json-file');
const {test} = require('tap');
const intersections = require('../lib/intersections');

test('chester street+abbot avenue.geojson', t => {
    const geojson = load.sync(path.join(__dirname, 'fixtures', 'chester street+abbot avenue.geojson'));
    const intersects = intersections(geojson.features);
    console.log(intersects);
    t.true(intersects.size = 1);
    t.true(intersects.get('-122.4577111!37.6885435').size = 2);
    t.end();
});
