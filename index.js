const fs = require('fs');
const path = require('path');
const tilebelt = require('tilebelt');
const tileReduce = require('tile-reduce');
const normalize = require('./lib/normalize');

/**
 * Cross Street indexer from OSM QA Tiles
 *
 * @param {string} mbtiles filepath to QA Tiles
 * @param {string} output filepath to store outputs
 * @param {*} [options] extra options
 * @param {Tile[]} [opitons.tiles] Filter by Tiles
 * @param {BBox} [options.bbox] Filter by BBox
 * @param {boolean} [options.debug=false] Enables DEBUG mode
 * @param {boolean} [options.verbose=false] Verbose output
 * @returns {EventEmitter} tile-reduce EventEmitter
 */
function indexer(mbtiles, output, options) {
    options = options || {};
    Object.assign(options, {
        zoom: 12,
        map: path.join(__dirname, 'lib', 'reducer.js'),
        sources: [{name: 'qatiles', mbtiles}],
        mapOptions: {
            output,
            debug: options.debug,
            verbose: options.verbose,
        }
    });
    return tileReduce(options);
}

/**
 * Load JSON from Cross Street Indexer cache
 *
 * @param {Tile|Quadkey} tile Tile [x, y, z] or Quadkey
 * @param {string} output filepath of cross-street-indexer cache
 * @returns {Map<string, [number, number]>} index Map<CrossStreet, LngLat>
 * @example
 * const index = load([[654, 1584, 12], [655, 1584, 12]], 'cross-street-index')
 */
function load(tile, output) {
    if (!tile) throw new Error('tile is required');
    if (!output) throw new Error('output is required');

    // Convert Tile to Quadkey
    let quadkey = tile;
    if (typeof tile !== 'string') quadkey = tilebelt.tileToQuadkey(tile);

    const index = new Map();
    const data = fs.readFileSync(path.join(output, quadkey + '.json'), 'utf8');
    for (let line of data.split('\n')) {
        line = line.trim();
        if (line) {
            const json = JSON.parse(line);
            const key = Object.keys(json)[0];
            index.set(key, json[key]);
        }
    }
    return index;
}

/**
 * Search Cross Street using Cross Street Index
 *
 * @param {string} name1 Road [name/ref]
 * @param {string} name2 Road [name/ref]
 * @param {Object|Map<string, [number, number]>} index JSON Object or Map<CrossStreet, LngLat>
 * @returns {[number, number]|undefined} Point coordinate [lng, lat]
 * @example
 * const point = search('Chester St', 'ABBOT AVE.', indexes);
 * //=point
 */
function search(name1, name2, index) {
    const pair = [normalize(name1), normalize(name2)].join('+');
    if (index.get) return index.get(pair);
    return index[pair];
}

module.exports = {
    load,
    indexer,
    search
};
