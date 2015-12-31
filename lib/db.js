'use strict';

let config = require('./config');
let format = require('pg-format');
let logger = require('./logger');
let pg = require('pg');

let connectionString = config.postgres;
let client = null;

module.exports = function db () {
  if (! client) {
    client = new pg.Client(connectionString);
  }

  return client;
};

//ST_MakePoint(x, y);
//Note x is longitude and y is latitude
module.exports.update = (id, lat, lon, done) => {
  //once update called, it means we call geocode.farm api
  //geocoded set to 1 only if lat lon is available
  let geocoded = 0;
  let geometry = 'NULL';

  if (lat && lon) {
    geocoded = 1;
    geometry = `ST_MakePoint(${lon}, ${lat})`;
  }

  let sql = format('UPDATE poi SET farmed = %L, geocoded = %L, geometry = %s WHERE id = %L', 1, geocoded, geometry, id);

  client.query(sql, (err) => {
    if (err) {
      logger.error(`[db] request incorrect ${err} | ${sql}`);
    }

    done && done();
  });
};
