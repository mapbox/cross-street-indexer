# Cross Street Indexer

[![Build Status](https://travis-ci.org/DenisCarriere/cross-street-indexer.svg?branch=master)](https://travis-ci.org/DenisCarriere/cross-street-indexer)
[![npm version](https://badge.fury.io/js/cross-street-indexer.svg)](https://badge.fury.io/js/cross-street-indexer)
[![Coverage Status](https://coveralls.io/repos/github/DenisCarriere/cross-street-indexer/badge.svg?branch=master)](https://coveralls.io/github/DenisCarriere/cross-street-indexer?branch=master)
[![MIT licensed](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/DenisCarriere/cross-street-indexer/master/LICENSE)

Blazing fast tile based geocoder that matches cross street (road intersections) entirely sourced by [OSM QA Tiles](https://osmlab.github.io/osm-qa-tiles/).

![image](https://cloud.githubusercontent.com/assets/550895/26292801/e6529ccc-3e86-11e7-9276-43b4bd11e336.png)

## Features

- Blazing fast 1/20th of a millisecond search (275,000 ops/sec)
- Processed United States OSM QA Tiles in 24m 27s (189714 tiles)
- Reads streaming index data
- Easy to use CLI to create & search index
- NodeJS 6 & 7 compatible
- Only uses Tile Reduce + Turf
- Indexes published on S3 buckets
- Bundled 5MB QA-Tiles for testing purposes

## Process

- [x] **Step 1**: Filter data from QA-Tiles (`lib/qa-tiles-filter.js`)
- [x] **Step 2**: Extract road intersections from QA-Tiles (`lib/intersections.js`)
- [x] **Step 3**: Normalize street name `ABBOT AVE. => abbot avenue` (`lib/normalize.js`)
- [x] **Step 4**: Convert intersections into multiple points using a combination of `road` & `ref` tags (`lib/geocoding-pairs`).
- [x] **Step 5**: Group all hashes into single Quadkey JSON object (`lib/reducer.js`)
- [x] **Step 6**: Generate index cache from QA Tiles via CLI (`bin/cross-street-indexer.js`)
- [x] **Step 7**: Stream or read from disk index caches via CLI (`bin/cross-street-search.js`)
- [x] **Step 8**: Publish to S3 `s3://cross-street-index/latest/<quadkey>.json`

## OSM QA Tiles

Users can download the entire planet or country extracts of OSM QA Tiles from https://osmlab.github.io/osm-qa-tiles.

![image](https://cloud.githubusercontent.com/assets/550895/26292784/cd17a0b8-3e86-11e7-8fde-cbc42de3f51e.png)

## Install

**npm**
```bash
$ npm install --global cross-street-indexer
```
**yarn**
```
$ yarn global add cross-street-indexer
```

## Quickstart

```bash
$ cross-street-indexer united_states_of_america.mbtiles
$ cross-street-search "Chester St" "ABBOT AVE."
-122.457711,37.688544
```

## CLI

### Cross Street Indexer

```
$ cross-street-indexer --help

  Cross Street Indexer

  Usage:
    $ cross-street-indexer <qa-tiles>
  Options:
    --output    [cross-street-index] Filepath to store outputs
    --bbox      Excludes QATiles by BBox
    --tiles     Excludes QATiles by an Array of Tiles
    --debug     [false] Enables DEBUG mode
  Examples:
    $ cross-street-indexer latest.planet.mbtiles
    $ cross-street-indexer latest.planet.mbtiles --tiles [[654,1584,12]]
    $ cross-street-indexer latest.planet.mbtiles --bbox [-122.519,37.629,-122.168,37.917]
```

### Cross Street Search

```
$ cross-street-search --help

  Cross Street Indexer

  Usage:
    $ cross-street-search <name1> <name2>
  Options:
    --output    [cross-street-index] filepath to Cross Street index output folder
    --tiles     Lookup index files via an Array of Tiles or Quadkeys
    --bbox      Lookup index files via BBox
    --latlng    Outputs LatLng instead of the default LngLat
    --stream    Enables reading from streaming index file (ignores tiles/bbox options)
  Examples:
    $ cross-street-search "Chester St" "ABBOT AVE."
    $ cross-street-search "Chester St" "ABBOT AVE." --tiles [[654,1584,12],[653,1585,12]]
    $ cross-street-search "Chester St" "ABBOT AVE." --tiles "023010221110,023010221110"
    $ cross-street-search "Chester St" "ABBOT AVE." --bbox [-122.5,37.6,-122.1,37.9]
    $ cat 023010221110.json | cross-street-search "Chester St" "ABBOT AVE."
    $ curl -s https://s3.amazonaws.com/cross-street-index/latest/023010221110.json | cross-street-search "Chester St" "ABBOT AVE." --stream
```

## Normalization Process

Normalization should follow the following standards:

- Drop any period if exists
  - ave. => avenue
- Street suffix to full name
  - ave => avenue
  - CIR => circle
  - ln => lane
  - HWY => highway
- Name should be entirely lowercase
  - Parkside Avenue => parkside avenue
- Direction to full word
  - N => north
  - S => south
  - NE => northeast
- Numbered street names to Abreviations
  - first => 1st
  - third => 3rd
  - ninth => 9th
  - fifth => 5th
- Remove any additional information
  - rodeo avenue trail (dead end ford bikes--no bikes on 101) => rodeo avenue trail

## Index (JSON Lines)

The Cross Street Index is stored in an easy to read key/value JSON Lines format.

- **key**: Normalized road pairs (`<name1>+<name2>`)
- **value**: Longitude & Latitude

```json
{"abbot avenue+chester street":[-122.457711,37.688544]}
{"chester street+abbot avenue":[-122.457711,37.688544]}
{"chester street+lisbon street":[-122.45821,37.68796]}
{"lisbon street+chester street":[-122.45821,37.68796]}
{"hoffman street+lisbon street":[-122.456764,37.687179]}
```

## Design Considerations

- [x] NodeJS Support ~4 & 5~ 6 & 7
- [ ] Multi-lingual tagging `name:en` & `name:fr`, etc...
- [ ] Secondary Link breaking road intersections
- [x] Match road intersections with/without road suffixes:
  - `abbot avenue+chester street`
  - `abbot+chester`
  - `abbot avenue+chester`
  - `abbot+chester street`
- [x] Normalized Highways use short names:
  - `HWY 417` => `highway 417`
  - `Highway 417` => `highway 417`
  - `ST 130` => `st 130`
  - `CA 130` => `ca 130`
- [ ] ?? Consider using `!` instead of `+` as separator (less common to have a `!` in a name)
- [ ] ?? Consider using abreviation suffixes:
  - Index cache file size reduced
  - Easier to normalize road names
  - Lowercross-street hashes combinations
  - Easier to match major highways
- [x] Add extra name to numbered highways `ref` & `name` ("CA 131" => ["ca 131", 131])
- [x] Add extra hash combination with the removal of street suffix (`rodeo avenue` => [`rodeo avenue`, `rodeo`])
- [x] Does not save empty z12 cross street indexes (reduces total number of files).
- [x] Extra `\n` at the bottom of the file (helps concatenate streams together).
- [x] Split `name` & `ref` code with `;` into Array of names.
- [x] Search output has `\n` at the end (`-122,37\n` or `-122,37`)
- [x] Loops create conflicts if cross street is in the same z12 tile.
- [x] Turning Circles without any names are exclude.
- [x] Loading more than 1 index cache might result in loss of data, however these conflicts are very minimal (ex: only 0.2% conflicts using 4 San Francisco tiles)

## OSM Attributes

- `name`: Street name (Abbot Avenue)
- `ref` Reference number normaly used to tag highways numbers
- [`highway`](http://wiki.openstreetmap.org/wiki/Key:highway) classification (residential, primary, secondary)
- [`bridge`](http://wiki.openstreetmap.org/wiki/Key:bridge) yes/no
- [`tunnel`](http://wiki.openstreetmap.org/wiki/Key:tunnel) yes/no
- `@id` OSM ID of street (way)

## Debugging

Including `--debug` will store additional files for each QA-Tile which can be helpful for debugging.

- `<output>/<quadkey>.json` - Cross Street index cache
- `<output>/<quadkey>/lines.geojson` - Filtered (Multi)LinesString from QA-Tile
- `<output>/<quadkey>/intersects.geojson` - Point which are intersecting roads
- `<output>/<quadkey>/debug.json` - Debug details

**debug.json**
```json
{
	"tile": [
		654,
		1584,
		12
	],
	"quadkey": "023010221110",
	"features": 49003,
	"lines": 2427,
	"intersects": 1921,
	"index": 3882
}

```

## References

- [Natural Node](https://github.com/NaturalNode/natural) to create fuzzy mathes
- [Carmen](https://github.com/mapbox/carmen) to normalize roads
- [LevelDB](https://github.com/google/leveldb) as storage
