const {coordEach} = require('@turf/meta');
const lineIntersect = require('@turf/line-intersect')
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
    var matches = new Map();
    for (var outer = 0; outer < features.length; outer++) {
        for (var inner = outer + 1; inner < features.length; inner++) {
            var pts = lineIntersect(features[inner], features[outer]).features;
            pts.forEach(function (pt) {
                const key = hash(pt.geometry.coordinates);
                const outerProps = extractProperties(features[outer])
                const innerProps = extractProperties(features[inner])

                if (matches.has(key)) matches.get(key).add(outerProps);
                else matches.set(key, new Set([outerProps]));

                matches.get(key).add(innerProps)
            })
        }
    }
    // const uniques = createUniques(features);
    const filtered = filterUniques(matches);
    return filtered;
}

function extractProperties(feature) {
    const properties = feature.properties;
    const newProperties = {};
    const {name, ref} = properties;
    if (name) newProperties.name = name;
    if (ref) newProperties.ref = ref;
    if (properties['name:en']) newProperties['name:en'] = properties['name:en'];
    if (properties['name:fr']) newProperties['name:fr'] = properties['name:fr'];
    return newProperties;
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
 * const uniques = createUniques([road1, road2]);
 * // Map {
 * //    '10!5' => Set { { name: 'Foo Ave' }, { name: 'Bar St' } },
 * //    '10!10' => Set { { name: 'Foo Ave' } },
 * //    '20!30' => Set { { name: 'Bar St' } }
 * // }
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
 * @example
 * const uniques = new Map([
 *     ['10!5', new Set([{name: 'Foo Ave'}, {name: 'Bar St'}])],
 *     ['10!10', new Set([{name: 'Foo Ave'}])],
 *     ['20!30', new Set([{name: 'Bar St'}])],
 * ]);
 * const filtered = filterUniques(uniques);
 * //= Map { '10!5' => Set { { name: 'Foo Ave' }, { name: 'Bar St'} } }
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
    intersections,
    createUniques,
    filterUniques,
};
