const {coordEach} = require('@turf/meta');
const {hash} = require('./utils');

/**
 * QA Tile to Point Intersections
 *
 * @param {Array<Feature>} features Array of Features from a single OSM QA Tile
 * @returns {Map<string, Set<Object>>} uniques Map<HashedCoord, Set<Properties>>
 * @example
 * const road1 = lineString([[10, 5], [10, 10]], {name: 'Foo Ave'});
 * const road2 = lineString([[10, 5], [20, 30]], {name: 'Bar St'});
 * intersections([road1, road2]);
 * //= Map { '10!5' => Set { { name: 'Foo Ave' }, { name: 'Bar St' } } }
 */
function intersections(features) {
    const uniques = createUniques(features);
    const filtered = filterUniques(uniques);
    return filtered;
}

/**
 * Create Uniques coordinates
 * Find Intersections with matching exact coordinates
 * Store index of feature to be able to retrieve properties afterwards
 *
 * @param {Array<Feature>} features Array of Features from a single OSM QA Tile
 * @returns {Map<string, Set<Object>>} uniques Map<HashedCoord, Set<Properties>>
 * @example
 * const road1 = lineString([[10, 5], [10, 10]], {name: 'Foo Ave'});
 * const road2 = lineString([[10, 5], [20, 30]], {name: 'Bar St'});
 * createUniques([road1, road2]);
 * //= Map { '10!5' => Set { { name: 'Foo Ave' }, { name: 'Bar St' } } }
 */
function createUniques(features) {
    const uniques = new Map();
    features.forEach((feature, index) => {
        coordEach(feature, coord => {
            const key = hash(coord);
            const {properties} = features[index];

            // Normalize name & ref
            // Strip Properties to only include Name & Ref
            const newProperties = {};
            const {name, ref} = properties;
            if (name) newProperties.name = name;
            if (ref) newProperties.ref = ref;
            if (properties['name:en']) newProperties['name:en'] = properties['name:en'];
            if (properties['name:fr']) newProperties['name:fr'] = properties['name:fr'];

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

module.exports = {
    intersections
};
