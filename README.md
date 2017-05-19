# Cross Street Indexer

## Process

- [x] **Step 1**: Extract road intersections from QA-Tiles
- [ ] **Step 2**: Create NLP web friendly hash
- [ ] **Step 3**: Dump hashes ready for S3 upload

## Features

- Easy to use CLI

## To-Do

- [ ] Review/complete [`osmify`](https://github.com/osmottawa/osmify) to parse random address into an OSM friendly schema.
- [ ] [Natural Node](https://github.com/NaturalNode/natural) to create hash
- [ ] [Carmen](https://github.com/mapbox/carmen) to normalize roads
- [ ] [LevelDB](https://github.com/google/leveldb) as storage
- [ ] S3 Bucket Upload to hashes
- [x] Use Map & Set

## Limitations

### Turning Circles

Turning Circles without any names are exclude, thus not finding any matches.

![image](https://cloud.githubusercontent.com/assets/550895/26234213/d26554b4-3c17-11e7-8f89-bee790f7118c.png)