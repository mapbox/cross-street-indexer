const {point, featureCollection} = require('@turf/helpers');
const {coordEach} = require('@turf/meta');

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
 * QA Tile to Point Intersections
 *
 * @param {Array<Feature>} features Array of Features from a single OSM QA Tile
 * @returns {FeatureCollection<Point>} points which intersect roads
 */
module.exports = function (features) {
    const uniques = createUniques(features);
    const intersections = uniquesFeatureCollection(uniques, features);
    return intersections;
};

/**
 * Create Uniques coordinates
 * Find Intersections with matching exact coordinates
 * Store index of feature to be able to retrieve properties afterwards
 *
 * @param {Array<Feature>} features Array of Features from a single OSM QA Tile
 * @returns {Map<Set<number>>} Map uses coordinates as key & Set uses feature index as key
 * @example
 * const uniques = createUniques(features);
 */
function createUniques(features) {
    const uniques = new Map();
    features.forEach((feature, index) => {
        coordEach(feature, coord => {
            const key = hash(coord);
            if (uniques.has(key)) uniques.get(key).add(index);
            else uniques.set(key, new Set([index]));
        });
    });
    return uniques;
}

/**
 * Creats a FeatureCollection from uniques intersection matches
 *
 * @param {Map<string, Set<number>>} uniques Map uses coordinates as key & Set uses feature index as key
 * @param {Array<Feature>} features features Array of Features from a single OSM QA Tile
 * @returns {FeatureCollection<Point>} cross street points
 */
function uniquesFeatureCollection(uniques, features) {
    const intersections = [];
    uniques.forEach((indexes, key) => {
        // Filter out uniques without 2 or more features
        if (indexes.size <= 1) return;

        // Remove intersections with same name
        let lastName;
        indexes.forEach(index => {
            const {properties} = features[index];
            const {name} = properties;
            if (name === lastName) indexes.delete(index);
            lastName = name;
        });
        if (indexes.size <= 1) return;

        // Add Feature properties to intersections
        indexes.forEach(index => {
            const coord = hash2coord(key);
            const intersection = point(coord, features[index].properties);
            intersections.push(intersection);
        });
    });
    return featureCollection(intersections);
}
