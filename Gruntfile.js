'use strict';

module.exports = function (grunt) {

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({

    clean: {
      build: {
        src: ['+(test|src)/**/*+(.d.ts|.js|.map)', '*+(.js|.d.ts|.map)', '!Gruntfile.js',]
      },
      coverage: {
        src: ['coverage']
      },
      test: {
        src: ['testResources/module/node_modules/stryker']
      }
    },

    jshint: {
      files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
      options: {
        node: true,
        globals: {
          jQuery: true
        },
        multistr: true,
        predef: [
          "describe",
          "xdescribe",
          "before",
          "beforeEach",
          "after",
          "afterEach",
          "xit",
          "it"
        ]
      }
    },
    watch: {
      testFiles: {
        files: ['test/**/*.js', 'src/**/*.js'],
        tasks: ['mochaTest:unit']
      }
    },
    /* End code coverage */

    ts: {
      options: {
        failOnTypeErrors: true
      },
      build: {
        tsconfig: {
          passThrough: true
        }
      },
    },

    tslint: {
      src: {
        src: ['*.ts', 'src/**/*.ts']
      },
      test: {
        src: ['test/**/*.ts']
      }
    },
     'npm-contributors': {
      options: {
        commitMessage: 'chore: update contributors'
      }
    },
    conventionalChangelog: {
      release: {
        options: {
          changelogOpts: {
            preset: 'angular'
          }
        },
        src: 'CHANGELOG.md'
      }
    },
    bump: {
      options: {
        commitFiles: [
          'package.json',
          'CHANGELOG.md'
        ],
        commitMessage: 'chore: release v%VERSION%',
        prereleaseName: 'rc'
      }
    }
  });

  grunt.registerTask('default', ['test']);
  grunt.registerTask('watch-test', ['test', 'watch']);
  grunt.registerTask('test', ['build', 'coverage']);
  grunt.registerTask('build', ['clean', 'tslint', 'ts']);
  grunt.registerTask('integration', ['mochaTest:integration']);
  grunt.registerTask('coverage', ['mocha_istanbul:coverage']);
  grunt.registerTask('serve', ['watch']);

  grunt.registerTask('release', 'Build, bump and publish to NPM.', function (type) {
    grunt.task.run([
      'test',
      'npm-contributors',
      'bump:' + (type || 'patch') + ':bump-only',
      'conventionalChangelog',
      'bump-commit',
      'npm-publish'
    ]);
  });
};
