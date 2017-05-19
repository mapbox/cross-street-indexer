const path = require('path');
const load = require('load-json-file');
const Benchmark = require('benchmark');
const intersections = require('./lib/intersections');

// Fixtures
const geojson = load.sync(path.join(__dirname, 'debug', '023010221131', 'features.geojson'));
const features = geojson.features;

/**
 * Benchmark Results
 *
 * // Using Object Dictionary (original source code)
 * intersections x 51.80 ops/sec ±1.53% (66 runs sampled)
 *
 * // Using Map/Set (50% increase)
 * intersections x 73.00 ops/sec ±2.88% (62 runs sampled)
 */
const suite = new Benchmark.Suite('cross-street-indexer');
suite
    .add('intersections', () => intersections(features))
    .on('cycle', e => console.log(String(e.target)))
    .on('complete', () => {})
    .run();
