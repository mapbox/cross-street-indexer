const path = require('path');
const {test} = require('tap');
const crossStreetIndexer = require('./');

const qaTiles = path.join(__dirname, 'test', 'latest.planet.mbtiles');

test('tiles', t => {
    const tiles = [
        [654, 1584, 12], [655, 1584, 12],
        [654, 1585, 12], [655, 1585, 12]
    ];
    crossStreetIndexer(qaTiles, 'cross-street-index', {tiles, debug: true});
    t.true(true);
    t.end();
});
