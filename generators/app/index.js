var yo = require('yeoman-generator'),
	path = require('path'),
	_ = require('lodash'),
	chalk = require('chalk'),
	util = require('util');


var Generator = module.exports = function Generator(args, options) {
	yo.generators.Base.apply(this, arguments);
};

util.inherits(Generator, yo.generators.Base);

Generator.prototype.prompting =  function () {
	var done = this.async();

	var prompts = [{
		name: 'appName',
		message: 'App name:',
		default: this.appname+'App'
	}, {
		name: 'appDesc',
		message: 'App description:',
		default: ''
	}];

	this.prompt(prompts, function (props) {
		this.appName = props.appName;
		this.appDesc = props.appDesc;
		done();
	}.bind(this));
};

Generator.prototype.skeleton = function () {
	this.mkdir('test');
	this.mkdir('test/server');
	this.mkdir('test/client');
	this.mkdir('public');
	this.mkdir('public/app');
	this.mkdir('public/assets');
	this.mkdir('public/assets/css');
	this.mkdir('public/assets/fonts');
	this.mkdir('public/assets/js');
};

Generator.prototype.scaffold = function () {
	var yo = this;
	var templates = [
		{src: '_bower.json', dest: 'bower.json'},
		{src: '_gulpfile.js', dest: 'gulpfile.js'},
		{src: '_index.html', dest: 'public/index.html'},
		{src: '_mocha.opts', dest: 'test/mocha.opts'},
		{src: '_package.json', dest: 'package.json'},
		{src: '_server.js', dest: 'server.js'}
	];

	_.map(templates, function (tmpl) {
		yo.template(tmpl.src, tmpl.dest, {appName: yo.appName, globalsPath: 'test/globals'});
	});

	this.copy('_.gitignore', '.gitignore');
	this.copy('_test.js', 'test/app.js');
	this.copy('_globals.js', 'test/globals.js');
};

Generator.prototype.install = {
	module: function () {
		this.composeWith('foundry:ngMod', {
			options: {
				modName: 'core',
				modURL: '',
				modState: 'index'
			}
		});
	},
	deps: function () {
		this.installDependencies();
	}
};

Generator.prototype.end = function () {
	console.log(chalk.green('Running post-install...'));
	var done = this.async();
	this.spawnCommand('gulp', ['postInstall'])
		.on('close', function () {
			console.log(chalk.green(this.appName + ' ready for development!'));
			done();
		}.bind(this));
};
