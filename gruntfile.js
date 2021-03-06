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
        externalModules: ['angular.filter', 'ngResource', 'ngSanitize', 'ngScrollbars', 'ui.router'],
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
        options: {
          mode: '0755'
        },
        files: [
          {
            expand: true,
            flatten: true,
            src: [
              'node_modules/angular/angular.min.js',
              'node_modules/angular-filter/dist/angular-filter.min.js',
              'node_modules/angular-resource/angular-resource.min.js',
              'node_modules/angular-sanitize/angular-sanitize.min.js',
              'node_modules/angular-ui-router/release/angular-ui-router.min.js',
              'node_modules/ng-scrollbars/dist/scrollbars.min.js'
            ],
            dest: 'assets/angular/'
          },
          {
            expand: true,
            flatten: true,
            src: [
              'node_modules/bootstrap/dist/css/bootstrap.min.css',
              'node_modules/bootstrap/dist/js/bootstrap.bundle.min.js'
            ],
            dest: 'assets/bootstrap/'
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
            dest: 'assets/fontawesome/webfonts/'
          },
          {
            expand: true,
            flatten: true,
            src: [
              'node_modules/@fortawesome/fontawesome-free/css/all.min.css'
            ],
            dest: 'assets/fontawesome/css/'
          },
          {
            expand: true,
            flatten: true,
            src: [
              'node_modules/jquery/dist/jquery.min.js'
            ],
            dest: 'assets/jquery/'
          },
          {
            expand: true,
            flatten: true,
            src: [
              'node_modules/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.css',
              'node_modules/malihu-custom-scrollbar-plugin/mCSB_buttons.png'
            ],
            dest: 'assets/jquery/plugins/malihu-custom-scrollbar-plugin'
          },
          {
            expand: true,
            flatten: true,
            src: [
              'node_modules/lodash/lodash.min.js'
            ],
            dest: 'assets/lodash/'
          }
        ]
      },
      fix: {
        options: {
          mode: '0755',
          process: (content) => content.replace(/\.attr\("tabindex","0"\)/g, '')
        },
        files: [
          {
            expand: true,
            flatten: true,
            src: [
              'node_modules/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.js'
            ],
            dest: 'assets/jquery/plugins/malihu-custom-scrollbar-plugin'
          }
        ]
      }
    },

    cssmin: {
      dist: {
        files: {
          'dist/<%= pkg.name %>.min.css': ['dist/<%= pkg.name %>.css']
        }
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
        src: ['app/templates/**/*.html'],
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

    // Compile SCSS to CSS
    sass: {
      dist: {
        files: {
          'dist/<%= pkg.name %>.css': 'styles/theme.scss'
        },
        options: {
          sourcemap: 'none',
          style: 'expanded',
          unixNewlines: true
        }
      }
    },

    // Watch for changes to source files
    watch: {
      src: {
        files: ['app/**/*', 'styles/**/*'],
        tasks: ['build']
      }
    }
  });

  // Load the NPM tasks
  grunt.loadNpmTasks('grunt-angular-builder');
  grunt.loadNpmTasks('grunt-angular-templates');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Define tasks
  grunt.registerTask('default', ['copy']);
  grunt.registerTask('build', ['clean', 'angular-builder', 'ngtemplates', 'uglify', 'sass', 'cssmin']);
};
