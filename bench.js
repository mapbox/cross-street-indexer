const path = require('path');
const load = require('load-json-file');
const Benchmark = require('benchmark');
const normalize = require('./lib/normalize');
const intersections = require('./lib/intersections');

// Fixtures
const geojson = load.sync(path.join(__dirname, 'test', 'fixtures', '023010221112', 'lines.geojson'));
const features = geojson.features;

/**
 * Benchmark Results
 *
 * normalize x 670,312 ops/sec ±2.30% (83 runs sampled)
 * intersections x 42.51 ops/sec ±3.29% (55 runs sampled)
 */
const suite = new Benchmark.Suite('cross-street-indexer');
suite
    .add('normalize', () => normalize('ABBOT AVE.'))
    .add('intersections', () => intersections(features))
    .on('cycle', e => console.log(String(e.target)))
    .on('complete', () => {})
    .run();

/**
 * Benchmark for single process
 *
 * normalize: 0.180ms
 * intersections: 28.634ms
 */
console.time('normalize');
normalize('ABBOT AVE.');
console.timeEnd('normalize');

console.time('intersections');
intersections(features);
console.timeEnd('intersections');

