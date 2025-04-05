'use strict';

const request = require('superagent');
const key = require('./config').key;

/**
 * Normalize and clean an address
 */
function clean(address, zip, city) {
  city = city === 'null' ? '' : city;
  city = city.replace(/\(.*?\)/g, '').replace(/CEDEX.*/g, '');
  zip = zip === 'null' ? '' : zip;
  address = address.replace(/BP.*/g, '').replace(/CS.*/g, '');
  return `${address} ${zip} ${city}`;
}

/**
 * Main GeocodeFarm function
 */
module.exports = function geocodeFarm(address, zip, city, callback) {
  const fullAddress = clean(address, zip, city);

  request
    .get('https://api.geocode.farm/forward/')
    .query({ addr: fullAddress })
    .query({ key })
    .end((err, res) => {
      if (err || !res.ok || !res.body || !res.body.RESULTS) {
        return callback(err || new Error('Invalid response from Geocode.Farm'), null);
      }

      const status = res.body.STATUS || {};
      const results = res.body.RESULTS.result || [];

      if (status.status !== 'SUCCESS') {
        return callback(new Error(`API returned status: ${status.status}`), null);
      }

      if (!results.length) {
        return callback(new Error('No geocoding results found'), null);
      }

      const result = results[0];
      const coordinates = result.coordinates || {};

      const data = {
        status_code: status.status,
        lat: coordinates.latitude || null,
        lon: coordinates.longitude || null,
        accuracy: result.accuracy || null,
        full_address: result.formatted_address || null,
        result: result,
        raw: res.body
      };

      return callback(null, data);
    });
};
