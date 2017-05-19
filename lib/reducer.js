const path = require('path');
const write = require('write-json-file');
const tilebelt = require('tilebelt');
const {featureCollection} = require('@turf/helpers');
const intersections = require('./intersections');

// Globals
const debug = global.mapOptions.debug;
const verbose = global.mapOptions.verbose;
const output = global.mapOptions.output;

// QA Tile reducer script
module.exports = (sources, tile, writeData, done) => {
    const features = sources.qatiles.osm.features;
    const intersects = intersections(features);
    const quadkey = tilebelt.tileToQuadkey(tile);

    // Output Features for Testing purposes
    if (debug || process.env.REGEN) {
        const debugPath = path.join(__dirname, '..', 'debug', quadkey) + path.sep;
        write.sync(debugPath + 'features.geojson', featureCollection(features));
        write.sync(debugPath + 'intersects.geojson', intersects);
    }
    if (verbose) {
        console.log({tile, quadkey, features: features.length, intersects: intersects.features.length});
    }
    done(null);
};
