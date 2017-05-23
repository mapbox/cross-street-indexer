const path = require('path');
const loadJSON = require('load-json-file');
const Benchmark = require('benchmark');
const normalize = require('./lib/normalize');
const intersections = require('./lib/intersections');
const {load, loads, search} = require('./');

// Fixtures
const geojson = loadJSON.sync(path.join(__dirname, 'test', 'fixtures', '023010221112', 'lines.geojson'));
const features = geojson.features;
const output = path.join(__dirname, 'test', 'fixtures', 'cross-street-index');
const tiles = [
    [654, 1584, 12], [655, 1584, 12],
    [654, 1585, 12], [655, 1585, 12]
];
const index = loads(tiles, output);

/**
 * Benchmark Results
 *
 * normalize x 617,804 ops/sec ±2.01% (86 runs sampled)
 * intersections x 14.29 ops/sec ±10.93% (38 runs sampled)
 * load x 71,717 ops/sec ±2.97% (86 runs sampled)
 * loads x 14,922 ops/sec ±3.46% (80 runs sampled)
 * search x 251,289 ops/sec ±6.67% (75 runs sampled)
 */
const suite = new Benchmark.Suite('cross-street-indexer');
suite
    .add('normalize', () => normalize('ABBOT AVE.'))
    .add('intersections', () => intersections(features))
    .add('load', () => load(tiles[0], output))
    .add('loads', () => loads(tiles, output))
    .add('search', () => search('Chester St', 'ABBOT AVE', index))
    .on('cycle', e => console.log(String(e.target)))
    .on('complete', () => {})
    .run();

/**
 * Benchmark for single process
 *
 * normalize: 0.084ms
 * intersections: 54.684ms
 * load: 22.161ms
 * loads: 59.381ms
 * search: 0.050ms
 */
console.time('normalize');
normalize('ABBOT AVE');
console.timeEnd('normalize');

console.time('intersections');
intersections(features);
console.timeEnd('intersections');

console.time('load');
load(tiles[0], output);
console.timeEnd('load');

console.time('loads');
loads(tiles, output);
console.timeEnd('loads');

console.time('search');
search('Chester St', 'ABBOT AVE.', index);
console.timeEnd('search');
