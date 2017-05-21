const suffixes = require('../models/suffixes');
const directions = require('../models/directions');
const numbers = require('../models/numbers');

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
module.exports = function (name) {
    if (!name) return name;

    // remove special characters
    name = name.replace(/[\.\+]/g, '');

    // Lowercase
    name = name.toLocaleLowerCase();

    // Remove trailing spaces
    name = name.trim();

    // Replace words with suffix & direction models
    const words = name.split(/[ ]+/);
    words.forEach((word, index) => {
        if (directions.has(word)) words[index] = directions.get(word);
        if (numbers.has(word)) words[index] = numbers.get(word);
        if (suffixes.has(word)) words[index] = suffixes.get(word);
    });
    return words.join(' ');
};
