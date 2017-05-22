const suffixes = require('../suffixes');

const inverse = new Map();
suffixes.forEach((value, key) => inverse.set(value, key));

module.exports = inverse;
