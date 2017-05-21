const fs = require('fs');
const path = require('path');
const write = require('write-json-file');
const mkdirp = require('mkdirp');
const tilebelt = require('tilebelt');
const featureCollection = require('@turf/helpers').featureCollection;
const utils = require('./utils');
const createIndex = require('./create-index');
const intersections = require('./intersections');
const qaTilesFilter = require('./qa-tiles-filter');
const uniques2features = utils.uniques2features;
const index2jsonl = utils.index2jsonl;

// Globals
const debug = global.mapOptions && global.mapOptions.debug;
const output = global.mapOptions && global.mapOptions.output;

// QA Tile reducer script
module.exports = (sources, tile, writeData, done) => {
    // Main processing
    const quadkey = tilebelt.tileToQuadkey(tile);
    const features = sources.qatiles.osm.features;
    const lines = qaTilesFilter(features);
    const intersects = intersections(lines);
    const index = createIndex(intersects);

    // Create folder if does not exist
    if (!fs.existsSync(output)) mkdirp.sync(output);

    // Output Features for Testing purposes
    if (debug || process.env.REGEN) {
        const debugPath = path.join(output, quadkey) + path.sep;

        // GeoJSON
        write.sync(debugPath + 'lines.geojson', featureCollection(lines));
        write.sync(debugPath + 'intersects.geojson', uniques2features(intersects));

        // Additional Information
        write.sync(debugPath + 'debug.json', {
            tile,
            quadkey,
            features: features.length,
            lines: lines.length,
            intersects: intersects.size,
            index: index.size
        });
    }
    // Output Results
    fs.writeFileSync(path.join(output, quadkey + '.json'), index2jsonl(index));
    done(null);
};
