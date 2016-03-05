'use strict';

let adresse = require('adresse');

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
  zip = zip === null || zip === 'null' ? '' : zip;
  address = address.replace(/BP.*/g, '')
    .replace(/CS.*/g, '');

  return `${address} ${zip} ${city}`;
};

module.exports = function farm (address, zip, city, callback) {
  let addr = clean(address, zip, city);

  adresse(addr, (err, coordinates) => {
    coordinates = coordinates || {};
    coordinates.address = addr;

    return callback && callback(err, coordinates);
  });
};
