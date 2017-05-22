const numbers = require('../numbers');

const inverse = new Map();
numbers.forEach((value, key) => inverse.set(value, key));

module.exports = inverse;
