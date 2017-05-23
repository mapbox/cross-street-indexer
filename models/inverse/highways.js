const highways = require('../highways');

const inverse = new Map();
highways.forEach((value, key) => inverse.set(value, key));

module.exports = inverse;
