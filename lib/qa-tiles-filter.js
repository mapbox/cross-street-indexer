/**
 * Filter to (Multi)LineString & remove extra properties
 *
 * @param {Array<number>} tile The [x,y,z] tile the features exist in
 * @param {object} features VectorTile layer of Features from a single OSM QA Tile
 * @returns {Array<Feature>} filtered Features to only (Multi)LineString
 * @example
 * const lines = filterQATiles(features);
 */
module.exports = function (tile, features) {
    const results = [];
    for (var i = 0; i < features.length; i++) {
        var feature = features.feature(i);

        // Only include lines
        if (feature.type !== 2) continue;

        // Only include highway OSM data
        if (!feature.properties.highway) continue;

        // Feature must have name or ref
        if (!feature.properties.name && !feature.properties.ref) continue;

        var geojson = feature.toGeoJSON(tile[0], tile[1], tile[2]);
        results.push(geojson);
    }

    return results;
};
