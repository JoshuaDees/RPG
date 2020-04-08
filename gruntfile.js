/**
 * Still To-Do:
 *  [ ] Copy assets
 */
module.exports = function(grunt) {
  // Configure Grunt
  grunt.initConfig({
    // Package Variable
    pkg: grunt.file.readJSON('package.json'),

    // Compile Angular
    'angular-builder': {
      options: {
        externalModules: ['ngResource', 'ui.router'],
        mainModule: '<%= pkg.name %>',
        releaseBuild: {
          moduleFooter: '\n'
        }
      },
      dist: {
        src: 'app/**/*.js',
        dest: 'dist/<%= pkg.name %>.js'
      }
    },

    // Remove unused files
    clean: {
      dist: ['dist/*']
    },

    // Copy asset files
    copy: {
      assets: {
        files: [
          {
            expand: true,
            flatten: true,
            src: [
              'node_modules/angular/angular.min.js',
              'node_modules/angular-resource/angular-resource.min.js',
              'node_modules/angular-ui-router/release/angular-ui-router.min.js'
            ],
            dest: 'assets/angular/',
            mode: '0755'
          },
          {
            expand: true,
            flatten: true,
            src: [
              'node_modules/bootstrap/dist/css/bootstrap.min.css',
              'node_modules/bootstrap/dist/js/bootstrap.bundle.min.js'
            ],
            dest: 'assets/bootstrap/',
            mode: '0755'
          },
          {
            expand: true,
            flatten: true,
            src: [
              'node_modules/@fortawesome/fontawesome-free/webfonts/fa-regular-400.eot',
              'node_modules/@fortawesome/fontawesome-free/webfonts/fa-regular-400.svg',
              'node_modules/@fortawesome/fontawesome-free/webfonts/fa-regular-400.ttf',
              'node_modules/@fortawesome/fontawesome-free/webfonts/fa-regular-400.woff',
              'node_modules/@fortawesome/fontawesome-free/webfonts/fa-regular-400.woff2',
              'node_modules/@fortawesome/fontawesome-free/webfonts/fa-solid-900.eot',
              'node_modules/@fortawesome/fontawesome-free/webfonts/fa-solid-900.svg',
              'node_modules/@fortawesome/fontawesome-free/webfonts/fa-solid-900.ttf',
              'node_modules/@fortawesome/fontawesome-free/webfonts/fa-solid-900.woff',
              'node_modules/@fortawesome/fontawesome-free/webfonts/fa-solid-900.woff2'
            ],
            dest: 'assets/fontawesome/webfonts/',
            mode: '0755'
          },
          {
            expand: true,
            flatten: true,
            src: [
              'node_modules/@fortawesome/fontawesome-free/css/all.min.css'
            ],
            dest: 'assets/fontawesome/css/',
            mode: '0755'
          },
          {
            expand: true,
            flatten: true,
            src: [
              'node_modules/jquery/dist/jquery.min.js'
            ],
            dest: 'assets/jquery/',
            mode: '0755'
          },
          {
            expand: true,
            flatten: true,
            src: [
              'node_modules/lodash/lodash.min.js'
            ],
            dest: 'assets/lodash/',
            mode: '0755'
          }
        ]
      }
    },

    // Transform templateUrl to template in Angular
    ngtemplates: {
      dist: {
        options: {
          append: true,
          htmlmin: {
            collapseBooleanAttributes: true,
            collapseWhitespace: true,
            keepClosingSlash: true,
            removeAttributeQuotes: true,
            removeComments: true,
            removeEmptyAttributes: true,
            removeRedundantAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true
          },
          module: '<%= pkg.name %>',
          quotes: 'single'
        },
        src: ['templates/**/*.html'],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },

    // Minimize the dist file
    uglify: {
      options: {
        mangle: false
      },
      dist: {
        files: {
          'dist/<%= pkg.name %>.min.js': 'dist/<%= pkg.name %>.js'
        }
      }
    },

    // Watch for changes to source files
    watch: {
      src: {
        files: ['app/**/*', 'templates/**/*'],
        tasks: ['build']
      }
    }
  });

  // Load the NPM tasks
  grunt.loadNpmTasks('grunt-angular-builder');
  grunt.loadNpmTasks('grunt-angular-templates');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Define tasks
  grunt.registerTask('default', ['copy']);
  grunt.registerTask('build', ['clean', 'angular-builder', 'ngtemplates', 'uglify']);
};
