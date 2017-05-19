const levenshtein = require('fast-levenshtein');

// NOT DONE

const source = 'parkside avenue+hillsborough boulevard';
const target = 'parkside avenue+hillsborough boulevard';

// const hash = jwt.sign({
//     name1: ['Parkside Avenue'],
//     name2: 'Hillsborough Boulevard'
// }, 'mapbox', {noTimestamp: true, algorithm: 'HS256'});

console.log(levenshtein.get(source, target));
// console.log(hash);
// console.log(jwt.decode(hash));

/**
parkside avenue
Parkside Avenue
Parkside Ave.
Parkside Ave

=>
parkside avenue
 */


search('parkside ave', 'hillsborough boulevard', [ 655, 1586, 12 ]);