'use strict';
const path = require('path');
const tileReduce = require('tile-reduce');
const write = require('write-json-file');
// const meow = require('meow');

const options = {
    tiles: [[655, 1586, 12]],
    zoom: 12,
    map: path.join(__dirname, 'reducer.js'),
    sources: [{name: 'qatiles', mbtiles: 'united_states_of_america.mbtiles'}],
};

tileReduce(options)
.on('reduce', (result, tile) => {
    write.sync(path.join(__dirname, 'test', 'out', tile.join('-') + '.geojson'), result);
})
.on('end', () => {
    console.log('done');
});
