const normalize = require('./normalize');
const hash2coord = require('./utils').hash2coord;

/**
 * Create Index from Uniques
 *
 * @param {Map<string, Set<Object>>} uniques Map<HashedCoord, Set<Properties>>
 * @returns {Map<string, [number, number]>} index Map<CrossStreet, LngLat>
 * @example
 * const properties = new Set([{ name: 'abbot avenue' }, { name: 'chester street' }]);
 * const uniques = new Map([['-122.4577111!37.6885435', properties]]);
 *
 * createIndex(uniques);
 * // {
 * //   'abbot avenue+chester street' => [ -122.4577111, 37.6885435 ],
 * //   'chester street+abbot avenue' => [ -122.4577111, 37.6885435 ]
 * // }
 */
module.exports = function (uniques) {
    const index = new Map();

    uniques.forEach((setProperties, hash) => {
        const names = new Set();
        const coord = hash2coord(hash);
        setProperties.forEach(properties => {
            const name = properties.name;
            const ref = properties.ref;
            // Split name & ref using ;
            // Normalize name (ave => avenue)
            if (name) name.split(/;/g).forEach(value => names.add(normalize(value)));
            if (ref) ref.split(/;/g).forEach(value => names.add(normalize(value)));

            // Match road intersections with/without road suffixes
            // names.forEach(name => {
            //     console.log(name);
            // });

            // Add numbered highways to names
        });

        // Sort names alphabetically
        const sorted = Array.from(names).sort();
        sorted.forEach((name1, index1) => {
            sorted.forEach((name2, index2) => {
                if (index1 === index2) return;
                index.set([name1, name2].join('+'), coord);
            });
        });
    });
    return index;
};
