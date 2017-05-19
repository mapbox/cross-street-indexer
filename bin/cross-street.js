#!/usr/bin/env node
const meow = require('meow');
const qaTiles = require('../lib/qa-tiles');

const cli = meow(`
  Usage:
    $ cross-street <qa-tiles>
  Options:
    --output    [cross-street] Filepath to store outputs
    --bbox      Excludes QATiles using BBox
    --tiles     Excludes QATiles using an Array of Tiles
    --debug     [false] Enables DEBUG mode
    --verbose   [false] Verbose output
  Examples:
    $ cross-street-index united_states_of_america.mbtiles cross-street/
`, {
    alias: {v: 'verbose'},
    boolean: ['verbose', 'debug']
});

// Handle user Inputs
if (!cli.input[0]) throw new Error('must provide a QA Tiles filepath');
const mbtiles = cli.input[0];
const output = cli.input[1] || 'cross-street';

// Handle Options
const options = cli.flags;

// BBox
if (options.bbox) options.bbox = JSON.parse(options.bbox);
if (options.bbox && options.bbox.length !== 4) throw new Error('invalid bbox');

// Tiles
if (options.tiles) options.tiles = JSON.parse(options.tiles);
if (options.tiles && !Array.isArray(options.tiles[0]) || options.tiles[0].length !== 3) throw new Error('invalid tiles');

qaTiles(mbtiles, output, options);
