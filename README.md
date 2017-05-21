# Cross Street Indexer

[![Build Status](https://travis-ci.org/DenisCarriere/cross-street-indexer.svg?branch=master)](https://travis-ci.org/DenisCarriere/cross-street-indexer)
[![npm version](https://badge.fury.io/js/cross-street-indexer.svg)](https://badge.fury.io/js/cross-street-indexer)
[![MIT licensed](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/DenisCarriere/cross-street-indexer/master/LICENSE)

Light weigth reverse geocoding for cross street 100% sourced from [OSM QA Tiles](https://osmlab.github.io/osm-qa-tiles/).

![image](https://cloud.githubusercontent.com/assets/550895/26235719/a8f8e7da-3c21-11e7-9240-c811f9b6a4aa.png)

## Features

- Blazing fast 1/20th of a millisecond search (275,000 ops/sec)
- Processed United States OSM QA Tiles in 35m 13s (189714 tiles)
- Easy to use CLI to build index
- Node 6 & 7 compatible
- Only uses Tile Reduce + Turf
- Ready for S3 Upload or LevelDB
- Bundled 5MB QA-Tiles for testing purposes

## Process

- [x] **Step 1**: Filter data from QA-Tiles (`lib/qa-tiles-filter.js`)
- [x] **Step 2**: Extract road intersections from QA-Tiles (`lib/intersections.js`)
- [x] **Step 3**: Normalize street name `ABBOT AVE. => abbot avenue` (`lib/normalize.js`)
- [x] **Step 4**: Convert intersections into multiple points using a combination of `road` & `ref` tags (`lib/geocoding-pairs`).
- [x] **Step 5**: Group all hashes into single Quadkey JSON object (`lib/reducer.js`)
- [ ] **Step 6**: Publish to S3 or LevelDB

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
$ cross-street-indexer latest.planet.mbtiles --tiles [[654,1584,12]]
$ cross-street-search "Chester St" "ABBOT AVE." --tiles [[654,1584,12]]
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
    --stream    Enables reading from streaming index file (ignores tiles options)
  Examples:
    $ cross-street-search "Chester St" "ABBOT AVE." --tiles [[654,1584,12]]
    $ cross-street-search "Chester St" "ABBOT AVE." --tiles '["023010221110"]'
    $ cat 023010221110.json | cross-street-search "Chester St" "ABBOT AVE."
```

## Normalization Process

Normalization should follow the following standards:

- Drop any period if exists
  - ave. => avenue
- Street suffix to full name
  - ave => avenue
  - CIR => circle
  - ln => lane
- Name should be entirely lowercase
  - Parkside Avenue => parkside avenue
- Direction to full word
  - N => north
  - S => south
  - NE => northeast
- Numbered streets to full word
  - 9th => ninth
  - 5th => fifth

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

## OSM Attributes

- `name`: Street name (Abbot Avenue)
- `ref` Reference number normaly used to tag highways numbers
- [`highway`](http://wiki.openstreetmap.org/wiki/Key:highway) classification (residential, primary, secondary)
- [`bridge`](http://wiki.openstreetmap.org/wiki/Key:bridge) yes/no
- [`tunnel`](http://wiki.openstreetmap.org/wiki/Key:tunnel) yes/no
- `@id` OSM ID of street (way)

## Debugging

Adding `--debug` will store `.geojson` items for each process & for each QA-Tile:

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
Additional files will be created in the `debug/` folder:

- `debug/<quadkey>/lines.geojson` - Filtered (Multi)LinesString from QA-Tile
- `debug/<quadkey>/intersects.geojson` - Point which are intersecting roads
- `debug/<quadkey>/index.json` - Final Cross Street index
- `debug/<quadkey>/debug.json` - Debug details

## Limitations

### Loops

Loops would return multiple cross street matches, only the last matched point is stored.

### Turning Circles

Turning Circles without any names are exclude, thus not finding any matches.

![image](https://cloud.githubusercontent.com/assets/550895/26234213/d26554b4-3c17-11e7-8f89-bee790f7118c.png)

## References

- [Natural Node](https://github.com/NaturalNode/natural) to create fuzzy mathes
- [Carmen](https://github.com/mapbox/carmen) to normalize roads
- [LevelDB](https://github.com/google/leveldb) as storage
