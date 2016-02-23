var fs = require('fs');
var mktmpdir = require('mktmpdir');
var osenv = require('osenv');
var path = require('path');
var request = require('supertest');
var test = require('tap').test;

test('Test project list', function(t) {
  mktmpdir(function(err, dir, done) {
    t.ifError(err);
    t.on('end', done);

    osenv.home = function() {
      return dir;
    };

    var app = require('../server/server');
    t.test('save a project', function(t) {
      request(app)
        .post('/projects')
        .send({
          name: 'foo',
          path: '/path/to/foo',
        })
        .expect(200, function(err, res) {
          t.ifError(err);
          t.end();
        });
    });

    t.test('.apiconnect dir is created', function(t) {
      fs.stat(path.join(dir, '.apiconnect', 'project.json'), function(err) {
        t.ifError(err);
        t.end();
      });
    });

    t.end();
  });
});
