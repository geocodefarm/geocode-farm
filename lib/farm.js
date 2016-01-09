'use strict';

let logger = require('./logger');
let request = require('superagent');

let check = function check (status) {
  let success = ['FREE_USER, ACCESS_GRANTED', 'KEY_VALID, ACCESS_GRANTED'];

  return success.indexOf(status.access) > - 1;
};

//Rquest example
//https://www.geocode.farm/v3/json/forward/?addr=530 W Main St Anoka MN 55303 US&country=us&lang=en&count=1
module.exports = function farm (address, zip, city, callback) {
  let addr = `${address} ${zip} ${city}`;

  request
  .get('http://www.geocode.farm/v3/json/forward')
  .query({'addr': addr})
  .query({'count': 10})
  //.query({'key': api_token})
  .end((err, res) => {
    let data = {};
    let results = res && res.body.geocoding_results.RESULTS || [];
    let status = res && res.body.geocoding_results.STATUS || [];

    if (! check(status)) {
      logger.error(`[geocode] API error with status ${status.access}`);
      return callback && callback(err, data);
    }

    //First of all, if more than 1 results, it means address is not enough
    //complete to match exact result
    if (results.length > 1) {
      logger.error(`[geocode] too more results for ${res.body.geocoding_results.STATUS.address_provided}`);
    } else if (results.length === 1) {
      data.latitude = results[0].COORDINATES.latitude;
      data.longitude = results[0].COORDINATES.longitude;
    }

    callback && callback(err, data);
  });
};
