// Copyright IBM Corp. 2015,2016. All Rights Reserved.
// Node module: strong-arc-project-list
// US Government Users Restricted Rights - Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

var fs = require('fs');
var semver = require('semver');

module.exports = function(server) {

  var Project = server.models.Project;
  var originalFind = Project.find;

  Project.find = function(filter, callback) {

    var originalArguments = arguments;
    return cleanupProjects(function(err) {
      if (err) return callback(err);
      return originalFind.apply(Project, originalArguments);
    });
  };

  function cleanupProjects(done) {
    originalFind.apply(Project, [ function(err, data) {
      if (err) {
        return done(err);
      }

      var nonExistProjects = [];
      data.forEach(function(project) {
        if (!pathExist(project.path)) {
          nonExistProjects.push(project.id);
        }
      });
      Project.destroyAll({ id: { inq: nonExistProjects } },
        function(err) {
          if (err) {
            return done(err);
          }
          return done();
        });
    },
   ]);
  };

  function pathExist(path) {
    if (semver.satisfies(process.versions.node, '<1.x')) {
      return fs.existsSync(path);
    } else {
      try {
        fs.accessSync(path, fs.F_OK);
        return true;
      } catch (e) {
        return false;
      }
    }
  }
};
