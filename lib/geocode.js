/*eslint-disable no-process-exit*/
'use strict';

const async = require('async');
const db = require('./db');
const farm = require('./farm');
const logger = require('./logger');
const prettyMs = require('pretty-ms');

module.exports = (rows) => {
  logger.info('Start POIs geocoding');
  const start = Date.now();

  async.map(rows, (row, done) => {
    farm(row.address, row.postal_code, row.city, (err, data) => {
      if (err || !data || !data.lat || !data.lon) {
        logger.error(`[geocode] Forward failed for row ID ${row.id} with error: ${err || 'No coordinates returned'}`);
        return done(true);
      }

      db.update(row.id, data.lat, data.lon, done);
    });
  }, (err) => {
    db().end();
    logger.info(`Geocoding done in ${prettyMs(Date.now() - start)}`);

    if (err) {
      logger.info(`Some errors occurred during geocoding. Not exiting with success.`);
      return;
    }

    // Useful for PM2 or similar to trigger restart
    process.exit(0);
  });
};
