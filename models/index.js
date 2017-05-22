const numbers = require('./numbers');
const suffixes = require('./suffixes');
const directions = require('./directions');

const models = new Map();
numbers.forEach((value, key) => models.set(key, value));
suffixes.forEach((value, key) => models.set(key, value));
directions.forEach((value, key) => models.set(key, value));

module.exports = models;
