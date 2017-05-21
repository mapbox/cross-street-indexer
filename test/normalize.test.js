const test = require('tap').test;
const normalize = require('../lib/normalize');

test('normalize', t => {
    t.equal(normalize('Chester St'), 'chester street', 'suffix');
    t.equal(normalize('Chester St E'), 'chester street east', 'direction');
    t.equal(normalize('+++Chester+ .St.'), 'chester street', 'remove special characters');
    t.equal(normalize('  Chester St    '), 'chester street', 'trailing spaces');
    t.equal(normalize('ABBOT AVE.'), 'abbot avenue', 'drop period');
    t.equal(normalize('ABBOT       AVENUE'), 'abbot avenue', 'multiple spaces');
    t.equal(normalize('ABBOT   AVENUE    N'), 'abbot avenue north', 'multiple word spaces');
    t.end();
});
