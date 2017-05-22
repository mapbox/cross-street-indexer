const test = require('tap').test;
const normalize = require('../lib/normalize');
const dropSuffixes = require('../lib/normalize').dropSuffixes;
const dropDirections = require('../lib/normalize').dropDirections;

test('normalize', t => {
    t.equal(normalize('Chester St'), 'chester street', 'suffix');
    t.equal(normalize('Chester St E'), 'chester street east', 'direction');
    t.equal(normalize('+++Chester+ .St.'), 'chester street', 'remove special characters');
    t.equal(normalize('  Chester St    '), 'chester street', 'trailing spaces');
    t.equal(normalize('ABBOT AVE.'), 'abbot avenue', 'drop period');
    t.equal(normalize('ABBOT       AVENUE'), 'abbot avenue', 'multiple spaces');
    t.equal(normalize('ABBOT   AVENUE    N'), 'abbot avenue north', 'multiple word spaces');
    t.equal(normalize('rodeo avenue trail (dead end ford bikes--no bikes on 101)'), 'rodeo avenue trail', 'extra comment');
    t.equal(normalize('1st St'), '1st street', 'numbered streets');
    t.equal(normalize('first St'), '1st street', 'numbered streets');
    t.end();
});

test('normalize - drop suffixes', t => {
    t.equal(dropSuffixes('Chester St'), 'chester', 'suffix');
    t.equal(dropSuffixes('Chester St E'), 'chester east', 'direction');
    t.equal(dropSuffixes('ABBOT   AVENUE    N'), 'abbot north', 'multiple word spaces');
    t.equal(dropSuffixes('rodeo avenue trail (dead end ford bikes--no bikes on 101)'), 'rodeo', 'extra comment');
    t.end();
});

test('normalize - drop directions', t => {
    t.equal(dropDirections('Chester St E'), 'chester street', 'direction');
    t.equal(dropDirections('ABBOT   AVENUE    N'), 'abbot avenue', 'multiple word spaces');
    t.end();
});
