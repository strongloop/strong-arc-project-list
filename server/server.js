var boot = require('loopback-boot');
var loopback = require('loopback');
var mkdirp = require('mkdirp');
var os = require('os');
var path = require('path');

var app = module.exports = loopback();

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    console.log('Web server listening at: %s', app.get('url'));
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
var configDir = path.join(os.homedir(), '.strong-arc');
mkdirp(configDir, function(err) {
  if (err) throw err;

  app.dataSource('db', {
    name: 'db',
    connector: 'memory',
    file: path.join(configDir, 'project.json'),
  });

  boot(app, __dirname, function(err) {
    if (err) throw err;

    // start the server if `$ node server.js`
    if (require.main === module)
      app.start();
  });
});