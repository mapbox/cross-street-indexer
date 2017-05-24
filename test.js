const path = require('path');
const {test} = require('tap');
const levelup = require('level');
const {load, loads, searchIndex, searchLevelDB, indexer} = require('./');

const qaTiles = path.join(__dirname, 'test', 'fixtures', 'latest.planet.mbtiles');
const output = path.join(__dirname, 'test', 'fixtures', 'cross-street-index');
const bbox = [-122.5, 37.6, -122.1, 37.9];
const tiles = [
    [654, 1584, 12], [655, 1584, 12],
    [654, 1585, 12], [655, 1585, 12]
];
const quadkeys = [
    '023010221110', '023010221111',
    '023010221112', '023010221113'
];

// Build new Index
if (process.env.REGEN) {
    test('indexer', t => {
        if (process.env.REGEN) indexer(qaTiles, output, {tiles});
        t.true(true, {skip: 'disable REGEN=true env for all tests'});
        t.end();
    });
// Use existing index
} else {
    const db = levelup(output);
    test('load', t => {
        t.equal(load(tiles[0], output).size, 14984, 'tiles');
        t.equal(load(quadkeys[0], output).size, 14984, 'quadkeys');
        t.end();
    });

    test('loads', t => {
        t.equal(loads(tiles, output).size, 40241, 'tiles');
        t.equal(loads(quadkeys, output).size, 40241, 'quadkeys');
        t.equal(loads(bbox, output).size, 40241, 'quadkeys');
        t.end();
    });

    test('searchIndex', t => {
        const match = searchIndex('Chester St', 'ABBOT AVE.', load(tiles[0], output));
        t.true(Array.isArray(match));
        t.end();
    });

    test('searchLevelDB - provide tile', t => {
        searchLevelDB('Chester St', 'ABBOT AVE.', db, tiles[0]).then(coord => {
            t.true(Array.isArray(coord));
            t.end();
        });
    });

    test('searchLevelDB - no tile', t => {
        searchLevelDB('Chester St', 'ABBOT AVE.', db).then(coord => {
            t.true(Array.isArray(coord));
            t.end();
        });
    });
}
