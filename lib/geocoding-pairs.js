const {hash2coord} = require('./utils');

/**
 * Generate Reverse Geocoding Pairs
 *
 * @param {Map<string, Set<Object>>} uniques Map<HashedCoord, Set<Properties>>
 * @returns {Map<string, Set<Array<number, number>>>} pairs Map<CrossStreet, Set<Coordinate>>
 * @example
 * const properties = new Set([{ name: 'abbot avenue' }, { name: 'chester street' }]);
 * const uniques = new Map([['-122.4577111!37.6885435', properties]]);
 *
 * geocodePairs(uniques);
 * // {
 * //   'abbot avenue+chester street' => [ -122.4577111, 37.6885435 ],
 * //   'chester street+abbot avenue' => [ -122.4577111, 37.6885435 ]
 * // }
 */
module.exports = function (uniques) {
    const pairs = new Map();
    uniques.forEach((setProperties, hash) => {
        const names = new Set();
        const coord = hash2coord(hash);
        setProperties.forEach(properties => {
            const {name, ref} = properties;
            if (name) names.add(name);
            if (ref) names.add(ref);
        });

        // Sort names alphabetically
        const sorted = Array.from(names).sort();
        sorted.forEach((name1, index1) => {
            sorted.forEach((name2, index2) => {
                if (index1 === index2) return;
                pairs.set([name1, name2].join('+'), coord);
            });
        });
    });
    return pairs;
};
