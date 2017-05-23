const {
    normalize,
    dropHighways,
    dropSuffixes,
    dropDirections,
    dropAbbreviations} = require('./normalize');
const {hash2coord} = require('./utils');

/**
 * Create Index from Uniques
 *
 * @param {Map<string, Set<Object>>} uniques Map<HashedCoord, Set<Properties>>
 * @param {string} [splitter="+"] character used to separate name combinations
 * @returns {Map<string, [number, number]>} index Map<CrossStreet, LngLat>
 * @example
 * const properties = new Set([{ name: 'abbot' }, { name: 'chester' }]);
 * const uniques = new Map([['-122.4!37.6', properties]]);
 * createIndex(uniques);
 * //= Map {'abbot+chester' => [ -122.4, 37.6 ], 'chester+abbot' => [ -122.4, 37.6 ] }
 */
function createIndex(uniques, splitter) {
    splitter = splitter || '+';
    const index = new Map();
    const uniqueNames = splitUniques(uniques);
    const normalizedNames = normalizeNames(uniqueNames);

    normalizedNames.forEach((names, hash) => {
        const coord = hash2coord(hash);
        names.forEach(name1 => {
            names.forEach(name2 => {
                if (name1 === name2) return;
                index.set([name1, name2].join(splitter), coord);

                // Drop Suffixes
                const dropMethods = [dropSuffixes, dropDirections, dropHighways, dropAbbreviations];
                dropMethods.forEach(drop => {
                    index.set([drop(name1, true), drop(name2, true)].join(splitter), coord);
                    index.set([drop(name1, true), name2].join(splitter), coord);
                    index.set([name1, drop(name2, true)].join(splitter), coord);
                });
            });
        });
    });
    return index;
}

/**
 * Split uniques by name, ref & semi-colons (;)
 *
 * @param {Map<string, Set<Object>>} uniques properties Map<HashedCoord, Set<Properties>>
 * @returns {map<string, Set<string>>} uniques names Map<HashedCoord, Set<Name>>
 * @example
 * const hash = '-122.4!37.6';
 * const properties = new Set([{name: 'Highway 130', ref: 'CA 130;HWY 130'}]);
 * const uniques = new Map([[hash, properties]]);
 * splitUniques(uniques)
 * //= Map {'-122.4!37.6' => Set { 'Highway 130', 'CA 130', 'HWY 130' } }
 */
function splitUniques(uniques) {
    const index = new Map();
    uniques.forEach((setProperties, hash) => {
        const names = new Set();
        setProperties.forEach(properties => {
            const name = properties.name;
            const ref = properties.ref;
            // Split name & ref using ;
            if (name) name.split(/;/g).forEach(value => names.add(value));
            if (ref) ref.split(/;/g).forEach(value => names.add(value));
        });
        index.set(hash, names);
    });
    return index;
}

/**
 * Normalize unique names
 *
 * @param {Map<string, Set<string>>} uniqueNames Map<HashedCoord, Set<Name>>
 * @returns {Map<string, Set<string>>} uniqueNames Map<HashedCoord, Set<Name>>
 * @example
 * const hash = '-122.4!37.6';
 * const names = new Set(['Highway 130', 'CA 130', 'HWY 130']);
 * const uniqueNames = new Map([[hash, names]);
 * normalizeNames(uniqueNames);
 * //= Map {'-122.4!37.6' => Set { 'hwy 130', 'ca 130' } }
 */
function normalizeNames(uniqueNames) {
    const index = new Map();
    uniqueNames.forEach((names, hash) => {
        const normalized = new Set();
        names.forEach(name => normalized.add(normalize(name)));
        index.set(hash, normalized);
    });
    return index;
}

module.exports = {
    createIndex,
    splitUniques,
    normalizeNames
};
