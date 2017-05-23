const highways = require('./inverse/highways');
const suffixes = require('./suffixes');
const directions = require('./directions');

const abbreviations = new Map();
highways.forEach((value, key) => abbreviations.set(key, value));
suffixes.forEach((value, key) => abbreviations.set(key, value));
directions.forEach((value, key) => abbreviations.set(key, value));

module.exports = abbreviations;
