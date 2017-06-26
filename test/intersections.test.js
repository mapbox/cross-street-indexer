const {test} = require('tap');
const {lineString} = require('@turf/helpers');
const {intersections, createUniques, filterUniques} = require('../lib/intersections');

test('intersections -- shared point', t => {
    const road1 = lineString([[10, 5], [10, 10]], {name: 'Foo Ave'});
    const road2 = lineString([[10, 5], [20, 30]], {name: 'Bar St'});
    const uniques = intersections([road1, road2]);
    //= Map { '10!5' => Set { { name: 'Foo Ave' }, { name: 'Bar St' } } }

    t.equal(uniques.size, 1);
    t.equal(uniques.get('10!5').size, 2);
    t.end();
});


test('intersections -- crossing point', t => {
    const road1 = lineString([[10, 0], [10, 10]], {name: 'Foo Ave'});
    const road2 = lineString([[8, 4], [12, 4]], {name: 'Bar St'});
    const uniques = intersections([road1, road2]);
    //= Map { '10!4' => Set { { name: 'Foo Ave' }, { name: 'Bar St' } } }

    t.equal(uniques.size, 1);
    t.equal(uniques.get('10!4').size, 2);
    t.end();
});
