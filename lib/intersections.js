const {coordEach} = require('@turf/meta');
const {hash, uniques2features} = require('./utils');

/**
 * QA Tile to Point Intersections
 *
 * @param {Array<Feature>} features Array of Features from a single OSM QA Tile
 * @returns {FeatureCollection<Point>} Points that intersect QA-Tiles (cross street)
 */
module.exports = function (features) {
    let uniques = createUniques(features);
    uniques = filterUniques(uniques);
    return uniques2features(uniques);
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
 * Applies more filtering
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
        let lastName;
        let uniqueNames = 0;
        setProperties.forEach(({name}) => {
            if (name === lastName) uniqueNames++;
            lastName = name;
        });
        if (uniqueNames <= 1) return;

        results.set(hashedCoord, setProperties);
    });
    return results;
}
