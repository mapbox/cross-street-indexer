const path = require('path');
const loadJSON = require('load-json-file');
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
 * @param {Tile[]} tiles Array of [x, y, z]
 * @param {string} output filepath of cross-street-indexer cache
 * @returns {Map<string, [number, number]>} index Map<CrossStreet, LngLat>
 * @example
 * const indexes = load([[654, 1584, 12], [655, 1584, 12]], 'cross-street-index')
 * //=indexes
 */
function load(tiles, output) {
    if (!tiles) throw new Error('tiles is required');
    if (!output) throw new Error('output is required');
    if (!Array.isArray(tiles) && !Array.isArray(tiles[0])) throw new Error('tiles is invalid');

    // Array of Tiles
    const index = new Map();
    tiles.forEach(tile => {
        const quadkey = tilebelt.tileToQuadkey(tile);
        const dump = loadJSON.sync(path.join(output, quadkey + '.json'));
        Object.keys(dump).forEach(hash => {
            index.set(hash, dump[hash]);
        });
    });
    return index;
}

/**
 * Search Cross Street using Cross Street Index
 *
 * @param {string} name1 Road [name/ref]
 * @param {string} name2 Road [name/ref]
 * @param {Map<string, [number, number]>} index Map<CrossStreet, LngLat>
 * @returns {[number, number]|undefined} Point coordinate [lng, lat]
 * @example
 * const point = search('Chester St', 'ABBOT AVE.', indexes);
 * //=point
 */
function search(name1, name2, index) {
    const pair = [normalize(name1), normalize(name2)].join('+');
    return index.get(pair);
}

module.exports = {
    load,
    indexer,
    search
};
