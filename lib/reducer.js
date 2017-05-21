const fs = require('fs');
const path = require('path');
const write = require('write-json-file');
const mkdirp = require('mkdirp');
const tilebelt = require('tilebelt');
const {featureCollection} = require('@turf/helpers');
const {uniques2features, index2jsonl} = require('./utils');
const qaTilesFilter = require('./qa-tiles-filter');
const intersections = require('./intersections');
const createIndex = require('./create-index');

// Globals
const debug = global.mapOptions.debug;
const output = global.mapOptions.output;

// QA Tile reducer script
module.exports = (sources, tile, writeData, done) => {
    const quadkey = tilebelt.tileToQuadkey(tile);
    const features = sources.qatiles.osm.features;
    const lines = qaTilesFilter(features);
    const intersects = intersections(lines);
    const index = createIndex(intersects);

    // Output Features for Testing purposes
    if (debug || process.env.REGEN) {
        const debugPath = path.join(__dirname, '..', 'debug', quadkey) + path.sep;

        // GeoJSON
        write.sync(debugPath + 'features.geojson', featureCollection(features));
        write.sync(debugPath + 'lines.geojson', featureCollection(lines));
        write.sync(debugPath + 'intersects.geojson', uniques2features(intersects));

        // Index
        const debugStream = fs.createWriteStream(debugPath + 'index.json');
        for (const line of index2jsonl(index)) {
            debugStream.write(JSON.stringify(line) + '\n');
        }
        // Debug
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
    if (!fs.existsSync(output)) mkdirp.sync(output);

    const stream = fs.createWriteStream(path.join(output, quadkey + '.json'));
    for (const line of index2jsonl(index)) {
        stream.write(JSON.stringify(line) + '\n');
    }
    done(null);
};
