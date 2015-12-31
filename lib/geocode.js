'use strict';

let async = require('async');
let db = require('./db');
let farm = require('./farm');
let logger = require('./logger');
let prettyMs = require('pretty-ms');

module.exports = (rows) => {
  logger.info('Start POIs geocoding');
  let start = Date.now();

  async.map(rows, (row, done) => {
    farm(row.address, row.postal_code, row.city, (err, data) => {
      if (err) {
        logger.error(`[geocode] Forward failed with geocode.farm ${err}`);
      }

      db.update(row.id, data.latitude, data.longitude, done);
    });
  }, (err) => {
    if (! err) {
      db().end();
      logger.info(`Geocoding done in ${prettyMs(Date.now() - start)}`);
    }
  });
};
