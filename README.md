# Cross Street Indexer

Light weigth reverse geocoding for cross street (intersecting roads).

![image](https://cloud.githubusercontent.com/assets/550895/26235719/a8f8e7da-3c21-11e7-9240-c811f9b6a4aa.png)

## Process

- [x] **Step 1**: Filter data from QA-Tiles (`lib/qa-tiles-filter.js`)
- [x] **Step 2**: Extract road intersections from QA-Tiles (`lib/intersections.js`)
- [ ] **Step 3**: Convert intersections into multiple points using a combination of `road` & `ref` tags.
- [ ] **Step 4**: Normalize QA-Tile Street name & Search function
- [ ] **Step 5**: Create NLP web friendly hash
- [ ] **Step 6**: Dump hashes ready for S3 upload

## Features

- Easy to use CLI
- Node 6 & 7 compatible
- Only uses Tile Reduce + Turf

## Attributes

- `name` OSM attribute
- `ref` OSM attribute
- [`highway`](http://wiki.openstreetmap.org/wiki/Key:highway) OSM attribute
- [`bridge`](http://wiki.openstreetmap.org/wiki/Key:bridge) OSM attribute
- [`tunnel`](http://wiki.openstreetmap.org/wiki/Key:tunnel) OSM attribute
- `@id` OSM road way

## Normalization

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

## Debugging

Adding `--verbose` will `stdout` a JSON object for each QA-Tile with the following information:

```
{
  tile: [ 655, 1586, 12 ],
  quadkey: '023010221131',
  features: 9626,
  intersects: 1053
}
```

Adding `--debug` will store `.geojson` items for each process & for each QA-Tile:

- `debug/<quadkey>/features.geojson` - raw GeoJSON of QA-Tile
- `debug/<quadkey>/lines.geojson` - Filtered (Multi)LinesString from QA-Tile
- `debug/<quadkey>/intersects.geojson` - Point which are intersecting roads

## Limitations

### Loops

Loops would return multiple cross street matches, only the last matched point is stored.



### Turning Circles

Turning Circles without any names are exclude, thus not finding any matches.

![image](https://cloud.githubusercontent.com/assets/550895/26234213/d26554b4-3c17-11e7-8f89-bee790f7118c.png)

## To-Do

- [ ] Review/complete [`osmify`](https://github.com/osmottawa/osmify) to parse random address into an OSM friendly schema.
- [ ] Use [JWT](https://github.com/auth0/node-jsonwebtoken) as hash?
- [ ] [Natural Node](https://github.com/NaturalNode/natural) to create hash
- [ ] [Carmen](https://github.com/mapbox/carmen) to normalize roads
- [ ] [LevelDB](https://github.com/google/leveldb) as storage
- [ ] S3 Bucket Upload to hashes
- [ ] Exact OSM match
- [ ] Fuzzy OSM match
- [x] Use Map & Set