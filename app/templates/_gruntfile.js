// Generated on 2014-02-16 using generator-pattern-primer 0.0.0
'use strict';

module.exports = function (grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    yeoman: {
      // configurable paths
      app: require('./bower.json').appPath || 'App',
      dist: 'dist',<% if (includeSass) { %>
      sass: '<%%= yeoman.app %>/src/main/resources/sass',<% } %>
      site: '<%%= yeoman.app %>/src/main/resources/public'
    },

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      js: {
        files: ['<%%= yeoman.site %>/scripts/{,*/}*.js'],
        tasks: ['jshint:all'],
        options: {
          livereload: true
        }
      },<% if (includeSass) { %>
      compass: {
        files: ['<%%= yeoman.sass %>/{,*/}*.{scss,sass}'],
        tasks: ['compass:server', 'autoprefixer']
      },<% } else { %>
      styles: {
        files: ['<%%= yeoman.site %>/styles/{,*/}*.css'],
        tasks: ['autoprefixer']
      },<% } %>
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        options: {
          livereload: true
        },
        files: [
          '<%%= yeoman.site %>/{,*/}*.html',
          '<%%= yeoman.site %>/styles/{,*/}*.css',
          '<%%= yeoman.site %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        '<%%= yeoman.site %>/scripts/{,*/}*.js'
      ]
    },

    // Add vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ['last 1 version']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '<%%= yeoman.site %>/styles/',
          src: '{,*/}*.css',
          dest: '<%%= yeoman.site %>/styles/'
        }]
      }
    },

    <% if (includeSass) { %>
    // Compiles Sass to CSS and generates necessary files if requested
    compass: {
      options: {
        sassDir: '<%%= yeoman.sass %>/',
        cssDir: '<%%= yeoman.site %>/styles',
        generatedImagesDir: '<%%= yeoman.site %>/images/generated',
        imagesDir: '<%%= yeoman.site %>/images',
        javascriptsDir: '<%%= yeoman.site %>/scripts',
        fontsDir: '<%%= yeoman.site %>/styles/fonts',
        importPath: '<%%= yeoman.site %>/components',
        httpImagesPath: '/images',
        httpGeneratedImagesPath: '/images/generated',
        httpFontsPath: '/styles/fonts',
        relativeAssets: false,
        assetCacheBuster: false,
        raw: 'Sass::Script::Number.precision = 10\n'
      },
      server: {
        options: {
          debugInfo: false
        }
      }
    }<% } %>

  });

  grunt.registerTask('build', [
    'compass:server',
    'autoprefixer',
    'jshint',
    'watch'
  ]);

  grunt.registerTask('default', ['build']);
};