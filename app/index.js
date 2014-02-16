'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');


var FinatraGenerator = module.exports = function AppGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  this.options = options;

  this.pkg = yeoman.file.readJSON(path.join(__dirname, '../package.json'));

  this.on('end', function () {
    if (!this.options['skip-install']) {
      this.installDependencies({
        bower: false,
        npm: true,
        skipInstall: false,
        callback: function () {
          console.log('Everything is ready!');
        }
      });
    }
  });
};
util.inherits(FinatraGenerator, yeoman.generators.Base);

FinatraGenerator.prototype.askFor = function() {
  var cb = this.async();

  // welcome message
  if (!this.options['skip-welcome-message']) {
    console.log(this.yeoman);
    console.log(chalk.magenta('Out of the box I include HTML5 Boilerplate and a Gruntfile.js to build your app.'));
  }

  var prompts = [{
      name: 'packageName',
      message: 'What is your package name?',
      default: 'com.myapp'
    },{
    type: 'checkbox',
    name: 'features',
    message: 'What more would you like?',
    choices: [{
      name: 'Sass with Compass',
      value: 'includeSass',
      checked: true
    }, {
      name: 'Bootstrap',
      value: 'includeBootstrap',
      checked: true
    }, {
      name: 'Modernizr',
      value: 'includeModernizr',
      checked: true
    }]
  }];

  this.prompt(prompts, function (answers) {
    var features = answers.features;

    function hasFeature(feat) { return features.indexOf(feat) !== -1; }

    this.packageName = answers.packageName;
    this.includeSass = hasFeature('includeSass');
    this.includeBootstrap = hasFeature('includeBootstrap');
    this.includeModernizr = hasFeature('includeModernizr');

    cb();
  }.bind(this));
};

FinatraGenerator.prototype.gruntfile = function gruntfile() {
  this.template('_gruntfile.js', 'Gruntfile.js');
};

FinatraGenerator.prototype.packageJSON = function packageJSON() {
  this.template('_package.json', 'package.json');
};

FinatraGenerator.prototype.bower = function bower() {
  this.copy('bowerrc', '.bowerrc');
  this.template('_bower.json', 'bower.json');
};

FinatraGenerator.prototype.editorConfig = function editorConfig() {
  this.copy('editorconfig', '.editorconfig');
};

FinatraGenerator.prototype.jshint = function jshint() {
  this.copy('jshintrc', '.jshintrc');
};

FinatraGenerator.prototype.mainStylesheet = function mainStylesheet() {
  if (this.includeSass) {
    this.mkdir('App/src/main/resources/sass');
    this.copy('main.scss', 'App/src/main/resources/sass/main.scss');
  } else {
    this.copy('main.css', 'App/src/main/resources/public/styles/main.css');
  }
};

FinatraGenerator.prototype.mainJavaScript = function mainJavaScript() {
  this.write('App/src/main/resources/public/scripts/main.js', '');
};

FinatraGenerator.prototype.writeIndex = function writeIndex() {
  this.indexFile = this.readFileAsString(path.join(this.sourceRoot(), 'index.html'));
  this.indexFile = this.engine(this.indexFile, this);

  // wire Twitter Bootstrap plugins
  if (this.includeBootstrap) {
    var bs = 'components/bootstrap' + (this.includeSass ? '-sass/vendor/assets/javascripts/bootstrap/' : '/js/');
    this.indexFile = this.appendScripts(this.indexFile, 'scripts/plugins.js', [
      bs + 'affix.js',
      bs + 'alert.js',
      bs + 'dropdown.js',
      bs + 'tooltip.js',
      bs + 'modal.js',
      bs + 'transition.js',
      bs + 'button.js',
      bs + 'popover.js',
      bs + 'carousel.js',
      bs + 'scrollspy.js',
      bs + 'collapse.js',
      bs + 'tab.js'
    ]);
  }

  this.indexFile = this.appendFiles({
    html: this.indexFile,
    fileType: 'js',
    optimizedPath: 'scripts/main.js',
    sourceFileList: ['scripts/main.js']
  });
};

FinatraGenerator.prototype.app = function app() {
  this.mkdir('App');
  this.directory('src', 'App/src');
  this.mkdir('App/src/main/scala');
  this.mkdir('App/src/test/scala');

  this.template('assembly.sbt' , 'App/assembly.sbt');
  this.template('build.sbt' , 'App/build.sbt');

  this.template('Procfile' , 'App/Procfile');
  this.copy('README.markdown' , 'App/README.md');
  this.write('App/src/main/resources/public/index.html', this.indexFile);

  var pomXml = this.readFileAsString(path.join(this.sourceRoot(), 'pom.xml')).replace(/%PACKAGENAME%/g, this.packageName);
  this.write('App/pom.xml', pomXml);
};

FinatraGenerator.prototype.project = function project() {
  this.directory('project', 'App/project');
};

FinatraGenerator.prototype.scala = function scala() {
  var folder  = this.packageName.replace('.', '/');
  var appDir  = 'App/src/main/scala/' + folder;
  var testDir = 'App/src/test/scala/' + folder;

  this.mkdir(appDir);
  this.mkdir(testDir);

  this.template('App.scala', appDir + '/App.scala');
  this.template('AppSpec.scala', testDir + '/AppSpec.scala');
};


FinatraGenerator.prototype.install = function install() {
  if (this.options['skip-install']) {
    return;
  }

  var done = this.async();
  this.installDependencies({
    skipMessage: this.options['skip-install-message'],
    skipInstall: this.options['skip-install'],
    callback: done
  });
};
