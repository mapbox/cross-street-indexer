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
    const uniques = {};
    const intersections = [];

    features.forEach((feature, index) => {
        // Exclude Points/Polygons
        if (feature.geometry.type !== 'LineString' && feature.geometry.type !== 'MultiLineString') return;
        if (!feature.properties.highway) return;

        // Find Intersections with matching exact coordinates
        // Store index of feature to be able to retrieve properties afterwards
        coordEach(feature, coord => {
            const key = hash(coord);
            if (uniques[key]) uniques[key].push(index);
            else uniques[key] = [index];
        });
    });
    // Filter out uniques without 2 or more features
    for (const key of Object.keys(uniques)) {
        // Exclude self closing ways (loops)
        uniques[key] = uniques[key].reduce((previous, current) => {
            if (previous.indexOf(current)) previous.push(current);
            return previous;
        }, []);
        // Add Feature properties to intersections
        if (uniques[key].length > 1) {
            for (const index of uniques[key]) {
                const {properties} = features[index];
                const newProps = {
                    name: properties.name,
                    highway: properties.highway
                };
                const coord = hash2coord(key);
                const intersection = point(coord, newProps);
                intersections.push(intersection);
            }
        }
    }
    return featureCollection(intersections);
};
