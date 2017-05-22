const models = require('../');

const inverse = new Map();
models.forEach((value, key) => inverse.set(value, key));

module.exports = inverse;
