const path = require('path');
const {test} = require('tap');
const {indexer, load, search} = require('./');

const qaTiles = path.join(__dirname, 'test', 'fixtures', 'latest.planet.mbtiles');
const output = path.join(__dirname, 'test', 'fixtures', 'sample-index');
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
    indexer(qaTiles, 'cross-street-index', {tiles, debug: true});
    t.true(true);
    t.end();
});

test('load', t => {
    t.true(load(tiles[0], output).size === 3882, 'tiles');
    t.true(load(quadkeys[0], output).size === 3882, 'quadkeys');
    t.end();
});

test('search', t => {
    const match = search('Chester St', 'ABBOT AVE.', load(tiles[0], output));
    t.true(Array.isArray(match));
    t.end();
});
