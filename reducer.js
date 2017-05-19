'use strict';
const {point, featureCollection} = require('@turf/helpers');
const {coordEach} = require('@turf/meta');
// const tilebelt = require('tilebelt');

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
 * Parse Hash coordinates
 *
 * @param {string} hashed coordinates
 * @returns {Array<number>} coord Coordinates
 * @example
 * parseHash('110!50')
 * //=[110, 50]
 */
function parseHash(hash) {
    return hash.split('!').map(n => Number(n));
}

module.exports = (data, tile, writeData, done) => {
    const uniques = {};
    const intersections = [];
    const features = data.qatiles.osm.features;

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
                const coord = parseHash(key);
                const intersection = point(coord, properties);
                intersections.push(intersection);
                // console.log(uniques[key]);
            }
            // intersections.push()
        }
    }
    done(null, featureCollection(intersections));
};
