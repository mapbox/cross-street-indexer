const path = require('path');
const write = require('write-json-file');
const tilebelt = require('tilebelt');
const {featureCollection} = require('@turf/helpers');
const {uniques2features, pairs2json} = require('./utils');
const qaTilesFilter = require('./qa-tiles-filter');
const intersections = require('./intersections');
const geocodingPairs = require('./geocoding-pairs');

// Globals
const debug = global.mapOptions.debug;
const verbose = global.mapOptions.verbose;
const output = global.mapOptions.output;

// QA Tile reducer script
module.exports = (sources, tile, writeData, done) => {
    const quadkey = tilebelt.tileToQuadkey(tile);
    const features = sources.qatiles.osm.features;
    const lines = qaTilesFilter(features);
    const intersects = intersections(lines);
    const pairs = geocodingPairs(intersects);

    // Output Features for Testing purposes
    if (debug || process.env.REGEN) {
        const debugPath = path.join(__dirname, '..', 'debug', quadkey) + path.sep;
        write.sync(debugPath + 'features.geojson', featureCollection(features));
        write.sync(debugPath + 'lines.geojson', featureCollection(lines));
        write.sync(debugPath + 'intersects.geojson', uniques2features(intersects));
        // Note: using no indentations only reduce the filesize by ~15% (readability vs. filesize)
        write.sync(debugPath + 'pairs.json', pairs2json(pairs));
    }
    if (verbose) {
        process.stdout.write(JSON.stringify({
            tile,
            quadkey,
            features: features.length,
            lines: lines.length,
            intersects: intersects.features.length
        }) + '\n');
    }
    // Output Results
    write.sync(path.join(output, quadkey + '.json'), pairs2json(pairs));
    done(null);
};
