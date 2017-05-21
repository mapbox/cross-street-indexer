const coordEach = require('@turf/meta').coordEach;
const normalize = require('./normalize');
const hash = require('./utils').hash;

/**
 * QA Tile to Point Intersections
 *
 * @param {Array<Feature>} features Array of Features from a single OSM QA Tile
 * @returns {Map<string, Set<Object>>} uniques Map<HashedCoord, Set<Properties>>
 */
module.exports = function (features) {
    return filterUniques(createUniques(features));
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
            const properties = features[index].properties;

            // Normalize name & ref
            // Strip Properties to only include Name & Ref
            const name = properties.name;
            const ref = properties.ref;
            const newProperties = {};
            if (name) newProperties.name = normalize(name);
            if (ref) newProperties.ref = normalize(ref);

            // Store unique coordinates with all properties
            if (uniques.has(key)) uniques.get(key).add(newProperties);
            else uniques.set(key, new Set([newProperties]));
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
            const name = properties.name;
            names.set(name, properties);
        });
        if (names.size <= 1) return;

        results.set(hashedCoord, new Set(names.values()));
    });
    return results;
}
