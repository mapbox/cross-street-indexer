const {hash2coord} = require('./utils');

/**
 * Generate Geocoding Pairs
 *
 * @param {Map<string, Set<Object>>} uniques Map<HashedCoord, Set<Properties>>
 */
module.exports = function (uniques) {
    uniques.forEach((setProperties, hash) => {
        const names = new Set();
        setProperties.forEach((properties, v) => {
            // console.log(v);
            const {name, ref} = properties;
            if (name) names.add(name);
            if (ref) names.add(ref);
        });
        // console.log(names);
    });
};
