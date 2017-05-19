const {test} = require('tap');
const qaTiles = require('./lib/qa-tiles');


test('cross-street-indexer - bbox', t => {
    qaTiles('united_states_of_america.mbtiles', 'cross-street', {bbox: [-122.539600, 37.668877, -122.359799, 37.839583]});
    t.true(true);
    t.end();
});

test('cross-street-indexer - tiles', t => {
    qaTiles('united_states_of_america.mbtiles', 'cross-street', {tiles: [[655, 1586, 12]]});
    t.true(true);
    t.end();
});
