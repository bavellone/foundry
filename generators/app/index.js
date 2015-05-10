var yo = require('yeoman-generator'),
	path = require('path'),
	_ = require('lodash'),
	chalk = require('chalk'),
	util = require('util'),
	async = require('async'),
	crypto = require('crypto');


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
	}, {
		name: 'debugEmail',
		message: 'Enter a debug email address:',
		default: ''
	}, {
		name: 'mailAPIKey',
		message: 'Enter a Mandrill API key:',
		default: ''
	}];

	this.prompt(prompts, function (props) {
		this.appName = props.appName;
		this.appDesc = props.appDesc;
		this.debugEmail = props.debugEmail;
		this.mailAPIKey = props.mailAPIKey;
		try {
			this.authSecret = crypto.randomBytes(16).toString('hex');
			this.sessSecret = crypto.randomBytes(16).toString('hex');
		}
		catch (e) {
			this.authSecret = '';
			this.sessSecret = '';
			console.log("Not enough entropy to generate secret keys, using empty string");
		}
		done();
	}.bind(this));
};

// TODO - Refactor into modules
// e.g. public, server, config, test

Generator.prototype.skeleton = function () {
	this.mkdir('test');
	this.mkdir('test/server');
	this.mkdir('test/client');

	this.mkdir('server');
	this.mkdir('server/config');
	this.mkdir('server/config/env');
	this.mkdir('server/libs');
	this.mkdir('server/app');

	this.mkdir('public');
	this.mkdir('public/app');
	this.mkdir('public/assets');
	this.mkdir('public/assets/css');
	this.mkdir('public/assets/fonts');
	this.mkdir('public/assets/js');
	this.mkdir('public/assets/vid');
	this.mkdir('public/assets/img');
};

Generator.prototype.scaffold = function () {
	var yo = this;
	var templates = [
		{src: 'app/_bower.json', dest: 'bower.json'},
		{src: 'app/_gulpfile.js', dest: 'gulpfile.js'},
		{src: 'app/_index.html', dest: 'public/index.html'},
		{src: 'config/_mocha.opts', dest: 'test/mocha.opts'},
		{src: 'app/_package.json', dest: 'package.json'},
		{src: 'app/_server.js', dest: 'server.js'},
		{src: 'config/_all.js', dest: 'server/config/env/all.js'},
		{src: 'config/_dev.js', dest: 'server/config/env/dev.js'},
		{src: 'config/_prod.js', dest: 'server/config/env/prod.js'},
		{src: 'config/_test.js', dest: 'server/config/env/test.js'}
	];
	var data = {
		globalsPath: 'test/globals'
	};
	var tmplData = _.merge(yo, data);

	_.map(templates, function (tmpl) {
		yo.template(tmpl.src, tmpl.dest, tmplData);
	});

	this.copy('config/_.gitignore', '.gitignore');
	this.copy('app/_test.js', 'test/app.js');
	this.copy('app/_config.scss', 'public/app/config.scss');
	this.copy('config/_globals.js', 'test/globals.js');
	this.copy('config/_config.js', 'server/config/config.js');
	this.copy('libs/_crud.js', 'server/libs/crud.js');
	this.copy('libs/_errors.js', 'server/libs/errors.js');
	this.copy('app/_init.js', 'server/init.js');
	this.copy('app/_api.js', 'server/api.js');
};


Generator.prototype.copyLibs = function () {
	this.copy('libs/_crud.js', 'server/libs/crud.js');
	this.copy('libs/_errors.js', 'server/libs/errors.js');
};

Generator.prototype.install = {
	module: function () {
		this.composeWith('foundry:ngMod', {
			options: {
				modName: 'core',
				modURL: '',
				useRouter: true,
				skipPrompts: true
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
	this.spawnCommand('gulp', ['build'])
		.on('close', function () {
			console.log(chalk.green(this.appName + ' ready for development!'));
			done();
		}.bind(this));
};
