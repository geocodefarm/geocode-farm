'use strict';
module.exports = {
  'postgres': 'postgres://username:password@localhost:5432/database',
  'query': 'SELECT id, address, postal_code, city FROM poi WHERE geocoded=0 AND farmed=0 LIMIT 250',
  'key': 'YOUR-API-KEY-HERE'
};
