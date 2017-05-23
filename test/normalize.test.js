const test = require('tap').test;
const normalize = require('../lib/normalization').normalize;
const dropSuffixes = require('../lib/normalization').dropSuffixes;
const dropDirections = require('../lib/normalization').dropDirections;
const dropAbbreviations = require('../lib/normalization').dropAbbreviations;
const dropHighways = require('../lib/normalization').dropHighways;

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
    t.equal(normalize('ST 130'), 'st 130', 'highway - ST => Street (however ST in this case is not used as a suffix)');
    t.equal(normalize('CA 130'), 'ca 130', 'highway');
    t.end();
});

test('normalize - dropSuffixes', t => {
    t.equal(dropSuffixes('Chester St'), 'chester', 'suffix');
    t.equal(dropSuffixes('Chester St E'), 'chester east', 'direction');
    t.equal(dropSuffixes('ABBOT   AVENUE    N'), 'abbot north', 'multiple word spaces');
    t.equal(dropSuffixes('rodeo avenue trail (dead end ford bikes--no bikes on 101)'), 'rodeo', 'extra comment');
    t.end();
});

test('normalize - dropDirections', t => {
    t.equal(dropDirections('Chester St E'), 'chester street');
    t.equal(dropDirections('ABBOT   AVENUE    N'), 'abbot avenue');
    t.end();
});

test('normalize - dropAbbreviations', t => {
    t.equal(dropAbbreviations('Chester St E'), 'chester');
    t.equal(dropAbbreviations('ABBOT   AVENUE    N'), 'abbot');
    t.equal(dropAbbreviations('HWY 130 Highway'), '130');
    t.end();
});

test('normalize - dropHighways', t => {
    t.equal(dropHighways('CA 130'), '130');
    t.equal(dropHighways('HWY 417'), '417');
    t.equal(dropHighways('CR 200'), '200');
    t.equal(dropHighways('HWY 417 Highway'), '417');
    t.end();
});
