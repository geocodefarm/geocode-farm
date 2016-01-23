/*eslint-disable no-process-exit*/
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
        return done(true);
      }

      db.update(row.id, data.latitude, data.longitude, done);
    });
  }, (err) => {
    db().end();
    logger.info(`Geocoding done in ${prettyMs(Date.now() - start)}`);

    if (err) {
      logger.info(`Exit without restart`);
      logger.info(`Geocoding done in ${prettyMs(Date.now() - start)}`);
      return;
    }

    //useful when using with PM2 or other process manager
    //to restart
    process.exit(0);
  });
};
