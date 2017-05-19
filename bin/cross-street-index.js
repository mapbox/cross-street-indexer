#!/usr/bin/env node
'use strict';

const meow = require('meow');

const cli = meow(`
  Usage:
    $ cross-street-index <qa-tile> <output>
  Options:
    --verbose   [false] Verbose output
  Examples:
    $ cross-street-index united_states_of_america.mbtiles tiles.geojson
`, {
    alias: {v: 'verbose'},
    boolean: ['verbose']
});
