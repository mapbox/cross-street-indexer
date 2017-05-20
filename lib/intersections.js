const {coordEach} = require('@turf/meta');
const {hash} = require('./utils');

/**
 * QA Tile to Point Intersections
 *
 * @param {Array<Feature>} features Array of Features from a single OSM QA Tile
 * @returns {Map<string, Set<Object>>} uniques Map<HashedCoord, Set<Properties>>
 */
module.exports = function (features) {
    let uniques = createUniques(features);
    uniques = filterUniques(uniques);
    return uniques;
};

/**
 * Create Uniques coordinates
 * Find Intersections with matching exact coordinates
 * Store index of feature to be able to retrieve properties afterwards
 *
 * @param {Array<Feature>} features Array of Features from a single OSM QA Tile
 * @returns {Map<string, Set<Object>>} uniques Map<HashedCoord, Set<Properties>>
 * @example
 * const uniques = createUniques(features);
 */
function createUniques(features) {
    const uniques = new Map();
    features.forEach((feature, index) => {
        coordEach(feature, coord => {
            const key = hash(coord);
            const {properties} = features[index];
            if (uniques.has(key)) uniques.get(key).add(properties);
            else uniques.set(key, new Set([properties]));
        });
    });
    return uniques;
}

/**
 * Apply filters to uniques intersection matches
 *
 * @param {Map<string, Set<Object>>} uniques Map<HashedCoord, Set<Properties>>
 * @returns {Map<string, Set<Object>>} uniques Map<HashedCoord, Set<Properties>>
 */
function filterUniques(uniques) {
    const results = new Map();
    uniques.forEach((setProperties, hashedCoord) => {
        // Filter out uniques without 2 or more features
        if (setProperties.size <= 1) return;

        // Remove intersections with same name
        const names = new Map();
        setProperties.forEach(properties => {
            const {name} = properties;
            names.set(name, properties);
        });
        if (names.size <= 1) return;

        results.set(hashedCoord, names.values());
    });
    return results;
}
