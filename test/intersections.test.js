const {test} = require('tap');
const {lineString} = require('@turf/helpers');
const {intersections, createUniques, filterUniques} = require('../lib/intersections');

test('intersections', t => {
    const road1 = lineString([[10, 5], [10, 10]], {name: 'Foo Ave'});
    const road2 = lineString([[10, 5], [20, 30]], {name: 'Bar St'});
    const uniques = intersections([road1, road2]);
    //= Map { '10!5' => Set { { name: 'Foo Ave' }, { name: 'Bar St' } } }

    t.equal(uniques.size, 1);
    t.equal(uniques.get('10!5').size, 2);
    t.end();
});

test('createUniques', t => {
    const road1 = lineString([[10, 5], [10, 10]], {name: 'Foo Ave'});
    const road2 = lineString([[10, 5], [20, 30]], {name: 'Bar St'});
    const uniques = createUniques([road1, road2]);
    // Map {
    //    '10!5' => Set { { name: 'Foo Ave' }, { name: 'Bar St' } },
    //    '10!10' => Set { { name: 'Foo Ave' } },
    //    '20!30' => Set { { name: 'Bar St' } }
    // }

    t.equal(uniques.size, 3);
    t.equal(uniques.get('10!5').size, 2);
    t.equal(uniques.get('10!10').size, 1);
    t.equal(uniques.get('20!30').size, 1);
    t.end();
});

test('filterUniques', t => {
    const uniques = new Map([
        ['10!5', new Set([{name: 'Foo Ave'}, {name: 'Bar St'}])],
        ['10!10', new Set([{name: 'Foo Ave'}])],
        ['20!30', new Set([{name: 'Bar St'}])],
    ]);
    const filtered = filterUniques(uniques);
    //= Map { '10!5' => Set { { name: 'Foo Ave' }, { name: 'Bar St'} } }

    t.equal(filtered.size, 1);
    t.equal(filtered.get('10!5').size, 2);
    t.false(filtered.has('10!10'));
    t.false(filtered.has('20!30'));
    t.end();
});
