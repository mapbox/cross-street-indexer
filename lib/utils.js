const helpers = require('@turf/helpers');
const mercator = require('global-mercator');
const slippyGrid = require('slippy-grid');
const point = helpers.point;
const featureCollection = helpers.featureCollection;

/**
 * Truncate decimals
 * Note: Filesize reduction of 20-25% (345KB => 261KB)
 *
 * @param {number} num single coordinate
 * @param {number} [precision=6] coordinate decimal precision
 * @returns {number} truncated number
 * truncate(10.12345678)
 * //=10.123457
 *
 * truncate(10.12345678, 2)
 * //=10.12
 *
 * truncate(10.12345678, 0)
 * //=10
 */
function truncate(num, precision) {
    precision = (precision !== undefined) ? precision : 6;
    const factor = Math.pow(10, precision);
    return Math.round(num * factor) / factor;
}

/**
 * Hash coordinates
 *
 * @param {Array<number>} coord Coordinates
 * @returns {string} hashed coordinates
 * @example
 * hash([110, 50])
 * //='110!50'
 */
function hash(coord) {
    const lng = truncate(coord[0]);
    const lat = truncate(coord[1]);
    return [lng, lat].join('!');
}

/**
 * Parse Hash to coordinates
 *
 * @param {string} hash coordinates
 * @returns {Array<number>} coord Coordinates
 * @example
 * hash2coord('110!50')
 * //=[110, 50]
 */
function hash2coord(hash) {
    return hash.split('!').map(n => Number(n));
}

/**
 * Converts Uniques to FeatureCollection
 *
 * @param {Map<string, Set<Object>>} uniques Map<HashedCoord, Set<Properties>>
 * @returns {FeatureCollection<Point>} Map converted to FeatureCollection
 */
function uniques2features(uniques) {
    const results = [];
    uniques.forEach((setProperties, hash) => {
        const coord = hash2coord(hash);
        setProperties.forEach(properties => {
            results.push(point(coord, properties));
        });
    });
    return featureCollection(results);
}

/**
 * Converts Index to JSON
 *
 * @param {Map<string, [number, number]>} index Map<CrossStreet, LngLat>
 * @returns {Object} JSON Object
 */
function index2json(index) {
    const results = {};
    index.forEach((coord, hash) => {
        results[hash] = coord;
    });
    return results;
}

/**
 * Converts Index to JSON Lines
 *
 * @param {Map<string, [number, number]>} index Map<CrossStreet, LngLat>
 * @returns {Object} JSON Lines Object
 * @example
 * index2jsonl(index)
 * // {"sneath lane+ca 82":[-122.421227,37.636821]}
 * // {"sneath lane+el camino real":[-122.421227,37.636821]}
 * // {"national avenue+sneath lane":[-122.423631,37.63571]}
 * // {"sneath lane+national avenue":[-122.423631,37.63571]}
 */
function index2jsonl(index) {
    const results = [];
    index.forEach((coord, hash) => {
        const line = {};
        line[hash] = coord;
        results.push(JSON.stringify(line));
    });
    return results.join('\n') + '\n';
}

/**
 * BBox to Tiles
 *
 * @param {BBox} bbox BBox [west, south, east, north]
 * @returns {Tile[]} Array of Google Tiles at z12
 */
function bbox2tiles(bbox) {
    return slippyGrid.all(bbox, 12, 12).map(tile => mercator.tileToGoogle(tile));
}

module.exports = {
    bbox2tiles,
    hash,
    hash2coord,
    uniques2features,
    index2json,
    index2jsonl
};
