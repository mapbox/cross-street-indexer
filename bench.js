const path = require('path');
const loadJSON = require('load-json-file');
const Benchmark = require('benchmark');
const normalize = require('./lib/normalize');
const intersections = require('./lib/intersections');
const {load, search} = require('./');

// Fixtures
const geojson = loadJSON.sync(path.join(__dirname, 'test', 'fixtures', '023010221112', 'lines.geojson'));
const features = geojson.features;
const output = path.join(__dirname, 'test', 'fixtures', 'cross-street-index');
const tiles = [
    [654, 1584, 12], [655, 1584, 12],
    [654, 1585, 12], [655, 1585, 12]
];
const indexes = load(tiles, output);

/**
 * Benchmark Results
 *
 * normalize x 489,296 ops/sec ±1.93% (76 runs sampled)
 * intersections x 11.19 ops/sec ±6.25% (30 runs sampled)
 * load x 70.76 ops/sec ±9.19% (60 runs sampled)
 * search x 276,174 ops/sec ±1.30% (86 runs sampled)
 */
const suite = new Benchmark.Suite('cross-street-indexer');
suite
    // .add('normalize', () => normalize('ABBOT AVE.'))
    // .add('intersections', () => intersections(features))
    // .add('load', () => load(tiles, output))
    .add('search', () => search('Chester St', 'ABBOT AVE', indexes))
    .on('cycle', e => console.log(String(e.target)))
    .on('complete', () => {})
    .run();

/**
 * Benchmark for single process
 *
 * normalize: 0.028ms
 * intersections: 122.525ms
 * load: 30.574ms
 * search: 0.034ms
 */
console.time('normalize');
normalize('ABBOT AVE');
console.timeEnd('normalize');

console.time('intersections');
intersections(features);
console.timeEnd('intersections');

console.time('load');
load(tiles, output);
console.timeEnd('load');

console.time('search');
search('Chester St', 'ABBOT AVE.', indexes);
console.timeEnd('search');
