const test = require('tap').test;
const lineString = require('@turf/helpers').lineString;
const createIndex = require('../lib/create-index').createIndex;
const intersections = require('../lib/intersections').intersections;

test('intersections', t => {
    const road1 = lineString([[10, 5], [10, 10]], {name: 'Foo Ave'});
    const road2 = lineString([[10, 5], [20, 30]], {name: 'Bar St'});
    const intersects = intersections([road1, road2]);
    const index = createIndex(intersects);

    t.equal(index.size, 8);

    // True
    t.true(index.has('foo avenue+bar street'));
    t.true(index.has('foo+bar'));
    t.true(index.has('foo+bar street'));
    t.true(index.has('foo avenue+bar'));
    t.true(index.has('bar street+foo avenue'));
    t.true(index.has('bar+foo'));
    t.true(index.has('bar+foo avenue'));
    t.true(index.has('bar street+foo'));

    // False
    t.false(index.has('foo avenue+foo'));
    t.false(index.has('foo+foo avenue'));
    t.false(index.has('bar street+bar'));
    t.false(index.has('bar+bar street'));
    t.end();
});
