const numbers = require('../models/numbers');
const suffixes = require('../models/suffixes');
const highways = require('../models/highways');
const directions = require('../models/directions');
const inverseSuffixes = require('../models/inverse/suffixes');
const inverseHighways = require('../models/inverse/highways');
const inverseDirections = require('../models/inverse/directions');
const inverseAbbreviations = require('../models/inverse/abbreviations');

/**
 * Normalization Process
 *
 * @param {string} name Road name or Ref
 * @returns {string} normalized name
 * @example
 * normalize('Chester St')
 * //= chester street
 *
 * normalize('ABBOT AVE.')
 * //= abbot avenue
 */
function normalize(name) {
    if (!name) return name;

    // remove special characters
    name = name.replace(/[\!\.\+]/g, '');

    // remove comments
    name = name.replace(/\([ a-z\-#|_\d]+\)/gi, '');

    // Lowercase
    name = name.toLocaleLowerCase();

    // Remove trailing spaces
    name = name.trim();

    // Replace words with suffix & direction models
    const words = name.split(/[ ]+/);
    words.forEach((word, index) => {
        // Suffix does not match 1st word
        if (index !== 0 && suffixes.has(word)) words[index] = suffixes.get(word);
        if (highways.has(word)) words[index] = highways.get(word);
        if (directions.has(word)) words[index] = directions.get(word);
        if (numbers.has(word)) words[index] = numbers.get(word);
    });
    return words.join(' ');
}

/**
 * Drop road suffixes to road name
 *
 * @param {string} name Road name/ref
 * @param {boolean} [normalized=false] prevents applying normalize method if (True)
 * @returns {string} name with dropped suffix
 * @example
 * dropSuffixes('Chester St')
 * //= chester
 *
 * dropSuffixes('ABBOT AVE.')
 * //= abbot
 */
function dropSuffixes(name, normalized) {
    if (normalized !== true) name = normalize(name);
    const result = [];
    const words = name.split(/[ ]+/);
    words.forEach(word => {
        if (!inverseSuffixes.has(word)) result.push(word);
    });
    return result.join(' ');
}

/**
 * Drop directions to road name
 *
 * @param {string} name Road name/ref
 * @param {boolean} [normalized=false] prevents applying normalize method if (True)
 * @returns {string} name with dropped direction
 * @example
 * dropDirections('Chester St N')
 * //= chester street
 *
 * dropDirections('ABBOT AVE. East')
 * //= abbot avenue
 */
function dropDirections(name, normalized) {
    if (normalized !== true) name = normalize(name);
    const result = [];
    const words = name.split(/[ ]+/);
    words.forEach(word => {
        if (!inverseDirections.has(word)) result.push(word);
    });
    return result.join(' ');
}

/**
 * Drop all abbreviations to road name
 *
 * @param {string} name Road name/ref
 * @param {boolean} [normalized=false] prevents applying normalize method if (True)
 * @returns {string} name with dropped all abbreviations
 * @example
 * dropAll('Chester St N')
 * //= chester
 *
 * dropAll('ABBOT AVE. East')
 * //= abbot
 */
function dropAbbreviations(name, normalized) {
    if (normalized !== true) name = normalize(name);
    const result = [];
    const words = name.split(/[ ]+/);
    words.forEach(word => {
        if (!inverseAbbreviations.has(word) && !inverseHighways.has(word)) result.push(word);
    });
    return result.join(' ');
}

/**
 * Drop all highways to road name
 *
 * @param {string} name Road name/ref
 * @param {boolean} [normalized=false] prevents applying normalize method if (True)
 * @returns {string} name with dropped all highways
 * @example
 * dropAll('HWY 417')
 * //= 417
 *
 * dropAll('CA 130')
 * //= 130
 */
function dropHighways(name, normalized) {
    if (normalized !== true) name = normalize(name);
    const result = [];
    const words = name.split(/[ ]+/);
    words.forEach(word => {
        if (!inverseHighways.has(word)) result.push(word);
    });
    return result.join(' ');
}

module.exports = {
    normalize,
    dropAbbreviations,
    dropSuffixes,
    dropDirections,
    dropHighways
};
