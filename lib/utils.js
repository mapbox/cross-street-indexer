const {point, featureCollection} = require('@turf/helpers');

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
    let [lng, lat] = coord;
    lng = truncate(lng);
    lat = truncate(lat);
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
 * Converts Uniques to FeatureCollection
 *
 * @param {Map<string, Set<Array<number, number>>>} pairs Map<CrossStreet, Set<Coordinate>>
 * @returns {Object} JSON Object
 */
function pairs2json(pairs) {
    const results = {};
    pairs.forEach((coord, hash) => {
        results[hash] = coord;
    });
    return results;
}

module.exports = {
    hash,
    hash2coord,
    uniques2features,
    pairs2json
};
