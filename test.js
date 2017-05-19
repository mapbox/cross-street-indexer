const path = require('path');
const load = require('load-json-file');
const {test} = require('tap');
const intersections = require('./lib/intersections');
const crossStreetIndexer = require('./');

const qaTiles = path.join(__dirname, 'test', 'latest.planet.mbtiles');

// test('bbox', t => {
//     const bbox = [-122.539600, 37.668877, -122.359799, 37.839583];
//     crossStreetIndexer(qaTiles, 'cross-street-index', {bbox, debug: true});
//     t.true(true);
//     t.end();
// });

test('tiles', t => {
    const tiles = [
        [654, 1584, 12], [655, 1584, 12],
        [654, 1585, 12], [655, 1585, 12]
    ];
    crossStreetIndexer(qaTiles, 'cross-street-index', {tiles, debug: true});
    t.true(true);
    t.end();
});

test('chester street+abbot avenue.geojson', t => {
    const geojson = load.sync(path.join(__dirname, 'test', 'fixtures', 'chester street+abbot avenue.geojson'));
    const intersects = intersections(geojson.features);
    t.true(intersects.features.length > 0);
    t.end();
});
