const path = require('path');
const {test} = require('tap');
const {indexer, load, search} = require('./');

const qaTiles = path.join(__dirname, 'test', 'fixtures', 'latest.planet.mbtiles');
const output = path.join(__dirname, 'test', 'fixtures', 'cross-street-index');
const tiles = [
    [654, 1584, 12], [655, 1584, 12],
    [654, 1585, 12], [655, 1585, 12]
];

test('indexer', t => {
    indexer(qaTiles, 'cross-street-index', {tiles, debug: true});
    t.true(true);
    t.end();
});

test('load', t => {
    const index = load(tiles, output);
    t.true(index.size === 10300);
    t.end();
});

test('search', t => {
    const match = search('Chester St', 'ABBOT AVE.', load(tiles, output));
    t.true(Array.isArray(match));
    t.end();
});
