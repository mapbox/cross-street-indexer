const fs = require('fs');
const path = require('path');
const write = require('write-json-file');
const mkdirp = require('mkdirp');
const tilebelt = require('tilebelt');
const {feature, featureCollection} = require('@turf/helpers');
const {createIndex} = require('./create-index');
const qaTilesFilter = require('./qa-tiles-filter');
const {intersections} = require('./intersections');
const {map2jsonl, map2json, set2json, uniques2features} = require('./utils');

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
        write.sync(debugPath + 'highways.geojson', featureCollection(highways));
        write.sync(debugPath + 'intersects.geojson', uniques2features(intersects));
        write.sync(debugPath + 'tile.geojson', feature(tilebelt.tileToGeoJSON(tile)));

        // Names
        const names = new Set([]);
        highways.forEach(feature => {
            if (feature.properties.name) names.add(feature.properties.name);
            if (feature.properties.ref) names.add(feature.properties.ref);
        });
        write.sync(debugPath + 'names.json', set2json(names));

        // Additional Information
        write.sync(debugPath + 'stats.json', {
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
