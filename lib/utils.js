const {point, featureCollection} = require('@turf/helpers');

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
    return coord.join('!');
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

module.exports = {
    hash,
    hash2coord,
    uniques2features
};
