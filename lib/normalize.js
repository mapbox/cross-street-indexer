const suffixes = require('../models/suffixes');
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
module.exports = function (name) {
    if (!name) return name;

    // strip characters
    name = name.replace(/\./, '');

    // Lowercase
    name = name.toLocaleLowerCase();

    // Remove trailing spaces
    name = name.trim();

    // Replace words with suffix & direction models
    const words = name.split(/[ ]+/);
    words.forEach((word, index) => {
        if (directions.has(word)) words[index] = directions.get(word);
        if (suffixes.has(word)) words[index] = suffixes.get(word);
    });
    return words.join(' ');
};
