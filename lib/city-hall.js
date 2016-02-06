'use strict';

let insee = require('insee');
let mairie = require('mairie');

let latlong = function latlong (code, callback) {
  if (! code) {
    return callback(true, {});
  }

  mairie(code, callback);
};

module.exports = function cityHall (zipcode, city, callback) {
  insee(zipcode, city, (err, code) => {
    if (err) {
      return callback && callback(err, {});
    }
    latlong(code, callback);
  });
};
