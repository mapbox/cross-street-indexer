const numbers = require('../models/numbers');
const suffixes = require('../models/suffixes');
const inverseSuffixes = require('../models/inverse/suffixes');
const inverseDirections = require('../models/inverse/directions');
const directions = require('../models/directions');

/**
 * Normalization Process
 *
 * @param {string} name Road name or Ref
 * @returns {string} normalized name
 * @example
 * normalize('Chester St')
 * //=chester street
 *
 * normalize('ABBOT AVE.')
 * //=abbot avenue
 */
function normalize(name) {
    if (!name) return name;

    // remove special characters
    name = name.replace(/[\.\+]/g, '');

    // remove comments
    name = name.replace(/\([ a-z\-#|_\d]+\)/gi, '');

    // Lowercase
    name = name.toLocaleLowerCase();

    // Remove trailing spaces
    name = name.trim();

    // Replace words with suffix & direction models
    const words = name.split(/[ ]+/);
    words.forEach((word, index) => {
        if (suffixes.has(word)) words[index] = suffixes.get(word);
        if (directions.has(word)) words[index] = directions.get(word);
        if (numbers.has(word)) words[index] = numbers.get(word);
    });
    return words.join(' ');
}

/**
 * Drop road suffix from Road name
 *
 * @param {string} name Road name/ref
 * @param {boolean} [normalized=false] prevents applying normalize method if (True)
 * @returns {string} name with dropped suffix
 * @example
 * dropSuffixes('Chester St')
 * //=chester
 *
 * dropSuffixes('ABBOT AVE.')
 * //=abbot
 */
function dropSuffixes(name, normalized) {
    if (normalized !== true) name = normalize(name);
    const words = [];
    name.split(/[ ]+/).forEach(word => {
        if (!inverseSuffixes.has(word)) words.push(word);
    });
    return words.join(' ');
}

/**
 * Drop direction from Road name
 *
 * @param {string} name Road name/ref
 * @param {boolean} [normalized=false] prevents applying normalize method if (True)
 * @returns {string} name with dropped direction
 * @example
 * dropDirections('Chester St N')
 * //=chester street
 *
 * dropDirections('ABBOT AVE. East')
 * //=abbot avenue
 */
function dropDirections(name, normalized) {
    if (normalized !== true) name = normalize(name);
    const words = [];
    name.split(/[ ]+/).forEach(word => {
        if (!inverseDirections.has(word)) words.push(word);
    });
    return words.join(' ');
}

module.exports = {
    normalize,
    dropSuffixes,
    dropDirections
};
