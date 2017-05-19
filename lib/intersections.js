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
    const uniques = new Map();
    const intersections = [];

    features.forEach((feature, index) => {
        // Exclude Points/Polygons
        if (feature.geometry.type !== 'LineString' && feature.geometry.type !== 'MultiLineString') return;
        if (!feature.properties.highway) return;
        if (!feature.properties.name) return;

        // Find Intersections with matching exact coordinates
        // Store index of feature to be able to retrieve properties afterwards
        coordEach(feature, coord => {
            const key = hash(coord);
            if (uniques.has(key)) {
                uniques.get(key).add(index);
            } else {
                uniques.set(key, new Set([index]));
            }
        });
    });
    uniques.forEach((indexes, key) => {
        // Filter out uniques without 2 or more features
        if (indexes.size <= 1) return;

        // Filter intersections with same name
        let lastName;
        let sameName = false;
        indexes.forEach(index => {
            const {properties} = features[index];
            const {name} = properties;
            // console.log(name);
            if (name === lastName) sameName = true;
            lastName = name;
        });
        if (sameName) return;

        // Add Feature properties to intersections
        indexes.forEach(index => {
            const {properties} = features[index];
            const newProps = {
                name: properties.name,
                highway: properties.highway,
                tunel: properties.tunel,
                bridge: properties.bridge,
                '@id': properties['@id']
            };
            const coord = hash2coord(key);
            const intersection = point(coord, newProps);
            intersections.push(intersection);
        });
    });
    return featureCollection(intersections);
};
