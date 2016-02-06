/*eslint-disable quotes*/

'use strict';
//key — API Key.
//Only Required for Paid Users.
//If not sepecified, Free User restrictions will apply.
//Located in Dashboard for Paid Users. P
//aid Users should include with every request to avoid Free User limits taking effect.
//Free Users should not specify or requests may fail due to Invalid API Key response.
module.exports = {
  'postgres': 'postgres://username:password@localhost:5432/database',
  'query': "SELECT id, postal_code, city FROM poi WHERE geocoded=0 AND farmed=0 AND type='Mairie' LIMIT 1"
  //'key': ...
};
