const path = require('path');
const {test} = require('tap');
const {execSync} = require('child_process');

const search = path.join(__dirname, '..', 'bin', 'cross-street-search.js');
const output = path.join(__dirname, 'fixtures', 'cross-street-index');

test('cli', t => {
    const options = {encoding: 'utf8'};
    const cmd = [search, '--output', output, '"Chester St"', '"ABBOT AVE."'];
    const result = '-122.457711,37.688544\n';

    t.assert(execSync([search, '--help'].join(' '), options), 'help');
    t.equal(execSync(cmd.concat(['--bbox', '[-122.5,37.6,-122.1,37.9]']).join(' '), options), result, 'bbox');
    t.equal(execSync(cmd.concat(['--tiles', '[[654,1584,12]]']).join(' '), options), result, 'tiles');
    t.equal(execSync(cmd.concat(['--tiles', '"023010221110"']).join(' '), options), result, 'quadkey');
    t.equal(execSync(cmd.concat(['--tiles', '023010221110,023010221110']).join(' '), options), result, 'quadkeys');
    t.equal(execSync(cmd.concat(['--tiles', '"023010221110, 023010221110"']).join(' '), options), result, 'quadkeys with spaces');
    t.end();
});
