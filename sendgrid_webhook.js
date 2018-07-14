var localtunnel = require('localtunnel');

localtunnel(5000, { subdomain: 'manoemaily929' }, function(err, tunnel) {
  console.log('Local Tunnel running');
});
