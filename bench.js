const path = require('path');
const load = require('load-json-file');
const Benchmark = require('benchmark');
const qaTilesFilter = require('./lib/qa-tiles-filter');
const intersections = require('./lib/intersections');

// Fixtures
const geojson = load.sync(path.join(__dirname, 'test', 'fixtures', '023010221112', 'lines.geojson'));
const features = geojson.features;

/**
 * Benchmark Results
 *
 * intersections x 48.16 ops/sec ±9.99% (50 runs sampled)
 * intersections: 20.182ms
 */
const suite = new Benchmark.Suite('cross-street-indexer');
suite
    .add('intersections', () => intersections(features))
    .on('cycle', e => console.log(String(e.target)))
    .on('complete', () => {})
    .run();

// Benchmark for single process
console.time('intersections');
intersections(qaTilesFilter(features));
console.timeEnd('intersections');
