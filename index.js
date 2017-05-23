const fs = require('fs');
const path = require('path');
const tilebelt = require('tilebelt');
const tileReduce = require('tile-reduce');
const normalize = require('./lib/normalization').normalize;
const bbox2tiles = require('./lib/utils').bbox2tiles;

/**
 * Cross Street indexer from OSM QA Tiles
 *
 * @param {string} mbtiles filepath to QA Tiles
 * @param {string} [output="cross-street-index"] filepath to store outputs
 * @param {*} [options] extra options
 * @param {Tile[]} [options.tiles] Filter by Tiles
 * @param {BBox} [options.bbox] Filter by BBox
 * @param {boolean} [options.debug=false] Enables DEBUG mode
 * @returns {EventEmitter} tile-reduce EventEmitter
 */
function indexer(mbtiles, output, options) {
    options = options || {};
    output = output || 'cross-street-index';
    const debug = options.debug;

    Object.assign(options, {
        zoom: 12,
        map: path.join(__dirname, 'lib', 'reducer.js'),
        sources: [{name: 'qatiles', mbtiles}],
        mapOptions: {
            output: output,
            debug: debug,
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
 * const index = load([654, 1584, 12], 'cross-street-index')
 * //=index
 */
function load(tile, output) {
    if (!tile) throw new Error('tile is required');
    if (!output) throw new Error('output is required');
    if (Array.isArray(tile) && typeof tile[0] !== 'number') throw new Error('must provide a single tile');

    // Convert Tile to Quadkey
    var quadkey = tile;
    if (typeof tile !== 'string') quadkey = tilebelt.tileToQuadkey(tile);
    if (typeof quadkey !== 'string') throw new Error('invalid tile or quadkey');

    // Load index cache
    const index = new Map();
    const indexPath = path.join(output, quadkey + '.json');
    if (!fs.existsSync(indexPath)) return index;

    // File Exists
    const read = fs.readFileSync(indexPath, 'utf8');
    read.split(/\n/g).forEach(line => {
        line = line.trim();
        if (line) {
            const data = JSON.parse(line);
            const key = Object.keys(data)[0];
            index.set(key, data[key]);
        }
    });
    return index;
}

/**
 * Load JSON from Cross Street Indexer cache
 *
 * @param {Tile[]|Quadkey[]|BBox} tiles Array of Tiles/Quadkeys or BBox
 * @param {string} output filepath of cross-street-indexer cache
 * @returns {Map<string, [number, number]>} index Map<CrossStreet, LngLat>
 * @example
 * const index = load([654, 1584, 12], 'cross-street-index')
 * //=index
 */
function loads(tiles, output) {
    if (!tiles) throw new Error('tiles is required');
    if (!output) throw new Error('output is required');
    if (!Array.isArray(tiles)) throw new Error('tiles must be an Array');

    // Convert BBox to Tiles
    if (typeof tiles[0] === 'number' && tiles.length === 4) tiles = bbox2tiles(tiles);

    // Combine all indexes
    const index = new Map();
    tiles.forEach(tile => {
        load(tile, output).forEach((value, key) => index.set(key, value));
    });
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
 * const point = search('Chester St', 'ABBOT AVE.', index);
 * //=[-122.457711, 37.688544]
 */
function search(name1, name2, index) {
    const pair = [normalize(name1), normalize(name2)].join('+');
    if (index.get) return index.get(pair);
    return index[pair];
}

module.exports = {
    load,
    loads,
    indexer,
    search
};
