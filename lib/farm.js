'use strict';

let logger = require('./logger');
let request = require('superagent');
//Get geocode.farm key
//let key = require('./config').key;

/**
 * Check the status from API
 *
 * @param  {Object} status
 * @return {Boolean}
 */
let check = function check (status) {
  const success = ['FREE_USER, ACCESS_GRANTED', 'KEY_VALID, ACCESS_GRANTED'];

  return success.indexOf(status.access) > - 1;
};

/**
 * Clean address
 *
 * @param  {String} address
 * @param  {String} zip
 * @param  {String} city
 * @return {String}
 */
let clean = function clean (address, zip, city) {
  city = city === 'null' ? '' : city;
  city = city.replace(/\(.*?\)/g, '')
    .replace(/CEDEX.*/g, '');
  zip = zip === 'null' ? '' : zip;
  address = address.replace(/BP.*/g, '')
    .replace(/CS.*/g, '');

  return `${address} ${zip} ${city}`;
};

let relevance = function relevance (results) {
  //Get the first one and validate as lat/long for
  //the give address only if accuracy is EXACT_MATCH or HIGH_ACCURACY
  const accuracy = ['EXACT_MATCH', 'HIGH_ACCURACY'];
  let first = results[0] || {};

  if (accuracy.indexOf(first.accuracy) > - 1) {
    return results.slice(0, 1);
  }

  return results;
};

//Rquest example
//https://www.geocode.farm/v3/json/forward/?addr=530 W Main St Anoka MN 55303 US&country=us&lang=en&count=1
module.exports = function farm (address, zip, city, callback) {
  let addr = clean(address, zip, city);

  request
  .get('http://www.geocode.farm/v3/json/forward')
  .query({'addr': addr})
  .query({'count': 10})
  .query({'country': 'fr'})
  //.query({'key': key})
  .end((err, res) => {
    let data = {};
    let geocodingResults = res && res.body.geocoding_results && res.body.geocoding_results.RESULTS || [];
    let status = res && res.body.geocoding_results && res.body.geocoding_results.STATUS || {};

    if (! check(status)) {
      if (! status.access) {
        logger.error(`[geocode] response.body ${JSON.stringify(res.body)} + addr ${addr}`);
      } else if (status.access === 'OVER_QUERY_LIMIT') {
        logger.error(`[geocode] API error with status ${status.access}`);
        //doesn't need to restart via pm2 or other monitoring packages
        return callback && callback(status.access);
      }
    }

    //First of all, if more than 1 results, it means address is not enough
    //complete to match exact result
    //We check the relevance
    let results = relevance(geocodingResults);

    if (results.length > 1) {
      logger.error(`[geocode] results not enough accurate for ${res.body.geocoding_results.STATUS.address_provided}`);
    } else if (results.length === 1) {
      data.latitude = results[0].COORDINATES.latitude;
      data.longitude = results[0].COORDINATES.longitude;
    } else if (results.length === 0) {
      logger.error(`[geocode] any results for ${addr}`);
    }

    callback && callback(err, data);
  });
};
