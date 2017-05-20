#!/usr/bin/env node
const fs = require('fs');
const meow = require('meow');
const {search, load} = require('../');

const cli = meow(`
  Usage:
    $ cross-street-search <name1> <name2>
  Options:
    --output    [cross-street-index] filepath to Cross Street index output folder
    --tiles     Lookup index files via Tiles or Quadkeys
    --bbox      (not implemented) Lookup index files via BBox
  Examples:
    $ cross-street-search "Chester St" "ABBOT AVE." --tiles '["023010221110"]'
`);

// Handle user Inputs
if (!cli.input[0]) throw new Error('<name1> is required');
if (!cli.input[1]) throw new Error('<name2> is required');
const name1 = cli.input[0];
const name2 = cli.input[1];

// Handle Options
const options = cli.flags;
const output = options.output || 'cross-street-index';
if (!fs.existsSync(output)) throw new Error(output + ' folder does not exists');

// BBox
if (options.bbox) {
    options.bbox = JSON.parse(options.bbox);
    if (options.bbox && options.bbox.length !== 4) throw new Error('invalid bbox');
}

// Tiles
if (options.tiles) {
    options.tiles = JSON.parse(options.tiles);
    if (Array.isArray(options.tiles)) {
        if (typeof options.tiles[0] === 'number') throw new Error('quadkeys must be strings');
        else if (
            typeof options.tiles[0] !== 'string' &&
            Array.isArray(options.tiles) &&
            options.tiles[0].length !== 3) throw new Error('tiles must contain 3 numbers [x,y,z]');
    } else throw new Error('invalid tiles');
}

// Load all tiles from folder (if Tiles not defined)
if (!options.tiles) {
    options.tiles = fs.readdirSync(output).map(filepath => {
        return filepath.replace('.json', '');
    });
}

const index = load(options.tiles, output);
const match = search(name1, name2, index);
if (match) process.stdout.write(match + '\n');
