#!/usr/bin/env node
const fs = require('fs');
const meow = require('meow');
const readline = require('readline');
const slippyGrid = require('slippy-grid');
const {search, load} = require('../');

const cli = meow(`
  Usage:
    $ cross-street-search <name1> <name2>
  Options:
    --output    [cross-street-index] filepath to Cross Street index output folder
    --tiles     Lookup index files via an Array of Tiles or Quadkeys
    --bbox      Lookup index files via BBox
    --latlng    Outputs LatLng instead of the default LngLat
    --stream    Enables reading from streaming index file (ignores tiles options)
  Examples:
    $ cross-street-search "Chester St" "ABBOT AVE." --tiles [[654,1584,12]]
    $ cross-street-search "Chester St" "ABBOT AVE." --tiles '["023010221110"]'
    $ cat 023010221110.json | cross-street-search "Chester St" "ABBOT AVE."
`, {
    boolean: ['stream', 'latlng']
});

// Handle user Inputs
if (!cli.input[0]) throw new Error('<name1> is required');
if (!cli.input[1]) throw new Error('<name2> is required');
const name1 = cli.input[0];
const name2 = cli.input[1];

// Handle Options
const options = cli.flags;
const output = options.output || 'cross-street-index';
if (!fs.existsSync(output)) throw new Error(output + ' folder does not exists');

let tiles;

// BBox
if (options.bbox) {
    const bbox = JSON.parse(options.bbox);
    if (bbox && bbox.length !== 4) throw new Error('invalid bbox');
    tiles = slippyGrid(bbox);
// Tiles
} else if (options.tiles) {
    tiles = JSON.parse(options.tiles);
    if (!Array.isArray(tiles)) throw new Error('invalid tiles');
    if (typeof tiles[0] === 'number') throw new Error('quadkeys must be strings');
    if (Array.isArray(tiles[0]) && tiles[0].length !== 3) throw new Error('tiles must contain 3 numbers [x,y,z]');
}

// Read index from stream
if (options.stream) {
    const stream = readline.createInterface({
        input: process.stdin
    });
    stream.on('line', line => {
        const index = JSON.parse(line);
        const match = search(name1, name2, index);
        if (match) {
            if (options.latlng) match.reverse();
            process.stdout.write(match + '\n');
            stream.close();
        }
    });

// Read index from files
} else {
    // Load all tiles from folder (if Tiles not defined)
    if (!tiles) {
        tiles = fs.readdirSync(output).map(filepath => {
            return filepath.replace('.json', '');
        });
    }

    // Finds a match for each tile
    for (const tile of tiles) {
        const index = load(tile, output);
        const match = search(name1, name2, index);
        if (match) {
            if (options.latlng) match.reverse();
            process.stdout.write(match + '\n');
            break;
        }
    }
}
