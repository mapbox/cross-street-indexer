const lineIntersect = require('@turf/line-intersect');
const {hash} = require('./utils');
const rbush = require('rbush');
const bbox = require('@turf/bbox');

const knownNames = [
    'name',
    'name:en',
    'name:fr',
    'ref',
    'name_1',
    'name_2',
    'name_3',
    'name_4',
    'name_5',
    'name_6',
    'name_7',
    'alt_name_1',
    'alt_name_2',
    'alt_name_3',
    'alt_name_4',
    'alt_name_5',
    'alt_name_6',
    'alt_name_7'
];

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
    var tree = rbush();
    var matches = new Map();

    features.forEach(function (ft) {
        var bound = bbox(ft);
        ft.minX = bound[0] - 0.0005;
        ft.minY = bound[1] - 0.0005;
        ft.maxX = bound[2] + 0.0005;
        ft.maxY = bound[3] + 0.0005;
        ft.properties = extractProperties(ft);

        tree.insert(ft);
    });

    features.forEach(function (ft) {
        tree.remove(ft);
        var collides = tree.search(ft);

        // for each bbox-collide, search for actual intersections
        collides.forEach(function (collision) {
            var pts = lineIntersect(ft, collision).features;
            pts.forEach(function (pt) {
                const key = hash(pt.geometry.coordinates);
                // const outerProps = extractProperties(ft);
                // const innerProps = extractProperties(collision);

                if (matches.has(key)) matches.get(key).add(ft.properties);
                else matches.set(key, new Set([ft.properties]));

                matches.get(key).add(collision.properties);
            });
        });
    });

    return matches;
}

function extractProperties(feature) {
    const properties = feature.properties;
    const newProperties = {names: []};

    // find any namelike properties
    knownNames.forEach(function (name) {
        if (properties[name]) newProperties.names.push(properties[name])
    });

    return newProperties;
}


module.exports = {
    intersections,
};
