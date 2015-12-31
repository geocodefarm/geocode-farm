'use strict';

let config = require('./lib/config');
let db = require('./lib/db')();
let logger = require('./lib/logger');
let geocode = require('./lib/geocode');

logger.info('Fetch POIs from DB');

db.connect();

let query = db.query(config.query);
let rows = [];

query.on('row', (row) => {
  rows.push(row);
});

query.on('end', () => {
  logger.info('Fetching done');
  geocode(rows);
});
