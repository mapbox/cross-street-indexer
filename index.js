const path = require('path');
const tileReduce = require('tile-reduce');

/**
 * QA-Tile reader
 *
 * @param {string} mbtiles Filepath to QA Tiles
 * @param {string} output Filepath to store outputs
 * @param {*} [options] extra options
 * @param {Array<Tile>} [opitons.tiles] Filter by Tiles
 * @param {Array<number>} [options.bbox] Filter by BBox
 * @param {boolean} [options.debug=false] Enables DEBUG mode
 * @param {boolean} [options.verbose=false] Verbose output
 * @returns {EventEmitter} tile-reduce EventEmitter
 */
module.exports = function (mbtiles, output, options) {
    options = options || {};
    Object.assign(options, {
        zoom: 12,
        map: path.join(__dirname, 'lib', 'reducer.js'),
        sources: [{name: 'qatiles', mbtiles}],
        mapOptions: {
            output,
            debug: options.debug,
            verbose: options.verbose,
        }
    });
    return tileReduce(options);
};
