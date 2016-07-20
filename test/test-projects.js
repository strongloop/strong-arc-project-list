// Copyright IBM Corp. 2015,2016. All Rights Reserved.
// Node module: strong-arc-project-list
// US Government Users Restricted Rights - Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

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

    var testObj1 = {
      name: 'foo',
      path: '/path/to/foo',
    };

    var testObj2 = {
      name: 'bar',
      path: __dirname,
      id: 2,
    };

    t.test('save a project', function(t) {
      request(app)
        .post('/projects')
        .send(testObj1)
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

    t.test('save another project where the path actually exist', function(t) {
      request(app)
        .post('/projects')
        .send({
          name: 'bar',
          path: __dirname,
        })
        .expect(200, function(err, res) {
          t.ifError(err);
          t.end();
        });
    });

    // only bar should be left, since foo's path does not exist
    t.test('list projects', function(t) {
      request(app)
        .get('/projects')
        .set('Accept', 'application/json')
        .expect(200, function(err, res) {
          t.ifError(err);
          t.deepEqual(res.body, [ testObj2 ]);
          t.end();
        });
    });

    t.end();
  });
});
