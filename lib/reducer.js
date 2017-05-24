const fs = require('fs');
const path = require('path');
const write = require('write-json-file');
const mkdirp = require('mkdirp');
const tilebelt = require('tilebelt');
const {feature, featureCollection} = require('@turf/helpers');
const {createIndex} = require('./create-index');
const qaTilesFilter = require('./qa-tiles-filter');
const {intersections} = require('./intersections');
const {map2jsonl, map2json, uniques2features} = require('./utils');

// Globals
const debug = global.mapOptions && global.mapOptions.debug;
const output = global.mapOptions && global.mapOptions.output;

// QA Tile reducer script
module.exports = (sources, tile, writeData, done) => {
    // Main processing
    const quadkey = tilebelt.tileToQuadkey(tile);
    const features = sources.qatiles.osm.features;
    const highways = qaTilesFilter(features);
    const intersects = intersections(highways);
    const index = createIndex(intersects);

    // Create folder if does not exist
    if (!fs.existsSync(output)) mkdirp.sync(output);

    // Output Features for Testing purposes
    if (debug) {
        const debugPath = path.join(output, quadkey) + path.sep;

        // GeoJSON
        const motorways = features.filter(feature => feature.properties.highway === 'motorway');
        write.sync(debugPath + 'motorways.geojson', featureCollection(motorways));
        write.sync(debugPath + 'highways.geojson', featureCollection(highways));
        write.sync(debugPath + 'intersects.geojson', uniques2features(intersects));
        write.sync(debugPath + 'tile.geojson', feature(tilebelt.tileToGeoJSON(tile)));

        // Names
        const motorwaysNames = new Set();
        motorways.forEach(feature => motorwaysNames.add(feature.properties.name));
        write.sync(debugPath + 'motorways-names.json', motorwaysNames.values());

        // Additional Information
        write.sync(debugPath + 'debug.json', {
            tile,
            quadkey,
            features: features.length,
            highways: highways.length,
            intersects: intersects.size,
            index: index.size
        });
    }
    // Output Results
    if (index.size) fs.writeFileSync(path.join(output, quadkey + '.json'), map2jsonl(index));
    done(null, map2json(index));
};
