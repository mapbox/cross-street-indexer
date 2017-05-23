const path = require('path');
const {test} = require('tap');
const {load, loads, searchIndex, searchLevelDB, indexer} = require('./');

const qaTiles = path.join(__dirname, 'test', 'fixtures', 'latest.planet.mbtiles');
const output = path.join(__dirname, 'test', 'fixtures', 'cross-street-index');
const leveldb = path.join(__dirname, 'test', 'fixtures', 'cross-street-index', 'leveldb');
const bbox = [-122.5, 37.6, -122.1, 37.9];
const tiles = [
    [654, 1584, 12], [655, 1584, 12],
    [654, 1585, 12], [655, 1585, 12]
];
const quadkeys = [
    '023010221110', '023010221111',
    '023010221112', '023010221113'
];

test('indexer', t => {
    indexer(qaTiles, 'cross-street-index', {tiles});
    t.true(true);
    t.end();
});

test('load', t => {
    t.equal(load(tiles[0], output).size, 14970, 'tiles');
    t.equal(load(quadkeys[0], output).size, 14970, 'quadkeys');
    t.end();
});

test('loads', t => {
    t.equal(loads(tiles, output).size, 40215, 'tiles');
    t.equal(loads(quadkeys, output).size, 40215, 'quadkeys');
    t.equal(loads(bbox, output).size, 40215, 'quadkeys');
    t.end();
});

test('searchIndex', t => {
    const match = searchIndex('Chester St', 'ABBOT AVE.', load(tiles[0], output));
    t.true(Array.isArray(match));
    t.end();
});

// test('searchLevelDB', t => {
//     const match = searchLevelDB('Chester St', 'ABBOT AVE.', leveldb, tiles[0]);
//     t.true(Array.isArray(match));
//     t.end();
// });
