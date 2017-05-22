const directions = require('../directions');

const inverse = new Map();
directions.forEach((value, key) => inverse.set(value, key));

module.exports = inverse;
