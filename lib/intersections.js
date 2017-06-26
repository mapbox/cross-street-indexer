const lineIntersect = require('@turf/line-intersect');
const {hash} = require('./utils');
const rbush = require('rbush');
const bbox = require('@turf/bbox');

const knownNames = ['name', 'name:en', 'name:fr', 'ref'];

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
                const outerProps = extractProperties(ft);
                const innerProps = extractProperties(collision);

                if (matches.has(key)) matches.get(key).add(outerProps);
                else matches.set(key, new Set([outerProps]));

                matches.get(key).add(innerProps);
            });
        });
    });

    return matches;
}

function extractProperties(feature) {
    const properties = feature.properties;
    const newProperties = {names: []};

    for (var key in properties) {
        if (knownNames.indexOf(key) > -1) {
            newProperties.names.push(properties[key]);
        } else if (key.indexOf('name_') > -1 || key.indexOf('alt_name_') > -1) {
            newProperties.names.push(properties[key]);
        }
    }

    // if (name) newProperties.name = name;
    // if (ref) newProperties.ref = ref;
    // if (properties['name:en']) newProperties['name:en'] = properties['name:en'];
    // if (properties['name:fr']) newProperties['name:fr'] = properties['name:fr'];
    return newProperties;
}


module.exports = {
    intersections,
};
