const abbreviations = require('../abbreviations');

const inverse = new Map();
abbreviations.forEach((value, key) => inverse.set(value, key));

module.exports = inverse;
