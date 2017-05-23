const {test} = require('tap');
const {normalize, dropSuffixes, dropDirections, dropAbbreviations, dropHighways} = require('../lib/normalize');

test('normalize', t => {
    t.equal(normalize('Chester St'), 'chester street');
    t.equal(normalize('Chester St E'), 'chester street east');
    t.equal(normalize('+++Chester+ .St.'), 'chester street');
    t.equal(normalize('  Chester St    '), 'chester street');
    t.equal(normalize('ABBOT AVE.'), 'abbot avenue');
    t.equal(normalize('ABBOT       AVENUE'), 'abbot avenue');
    t.equal(normalize('ABBOT   AVENUE    N'), 'abbot avenue north');
    t.equal(normalize('rodeo avenue trail (dead end ford bikes--no bikes on 101)'), 'rodeo avenue trail');
    t.equal(normalize('1st St'), '1st street');
    t.equal(normalize('first St'), '1st street');
    t.equal(normalize('ST 130'), 'st 130');
    t.equal(normalize('CA 130'), 'ca 130');
    t.equal(normalize('HWY 417'), 'highway 417');
    t.equal(normalize('Highway 417'), 'highway 417');
    t.equal(normalize('St-Joseph Blvd'), 'st-joseph boulevard');
    t.equal(normalize('St Joseph Blvd'), 'st joseph boulevard');
    t.equal(normalize('Saint Joseph Blvd'), 'saint joseph boulevard');
    t.equal(normalize(17), '17');
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
