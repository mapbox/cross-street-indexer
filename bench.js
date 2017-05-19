const path = require('path');
const load = require('load-json-file');
const Benchmark = require('benchmark');
const qaTilesFilter = require('./lib/qa-tiles-filter');
const intersections = require('./lib/intersections');

// Fixtures
const geojson = load.sync(path.join(__dirname, 'debug', '023010221131', 'features.geojson'));
const features = geojson.features;

/**
 * Benchmark Results
 *
 * qaTilesFilter x 1,146 ops/sec ±2.60% (84 runs sampled)
 * intersections x 77.25 ops/sec ±2.51% (65 runs sampled)
 * qaTilesFilter: 1.079ms
 * intersections: 13.425ms
 */
const suite = new Benchmark.Suite('cross-street-indexer');
suite
    .add('qaTilesFilter', () => qaTilesFilter(features))
    .add('intersections', () => intersections(qaTilesFilter(features)))
    .on('cycle', e => console.log(String(e.target)))
    .on('complete', () => {})
    .run();

// Benchmark for single process
console.time('qaTilesFilter');
qaTilesFilter(features);
console.timeEnd('qaTilesFilter');
console.time('intersections');
intersections(qaTilesFilter(features));
console.timeEnd('intersections');
