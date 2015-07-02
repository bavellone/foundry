var yo = require('yeoman-generator'),
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
		name: 'appNS',
		message: 'App namespace (short, simple & unique):',
		default: ''
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
		this.appNS = props.appNS;
		this.appDesc = props.appDesc;
		this.debugEmail = props.debugEmail;
		this.mailAPIKey = props.mailAPIKey;
		done();
	}.bind(this));
};

Generator.prototype.meta = function() {
	var yo = this;
	_.map([
		{src: 'meta/_gulpfile.js', dest: 'gulpfile.js'},
		{src: 'meta/_package.json', dest: 'package.json'}
	], function(tmpl) {
		yo.template(tmpl.src, tmpl.dest, yo);
	});

	this.copy('meta/_.gitignore', '.gitignore');
	this.copy('meta/_bower.json', 'bower.json');
};

Generator.prototype.server = function () {
	this.mkdir('server');
	this.mkdir('server/config');
	this.mkdir('server/config/env');
	this.mkdir('server/libs');
	this.mkdir('server/libs/mail');
	this.mkdir('server/app');

	var yo = this;
	_.map([
		{src: 'server/_server.js', dest: 'server.js'},
		{src: 'server/config/_config.js', dest: 'server/config/config.js'},
		{src: 'server/config/_all.js', dest: 'server/config/env/all.js'},
		{src: 'server/config/_dev.js', dest: 'server/config/env/dev.js'},
		{src: 'server/config/_prod.js', dest: 'server/config/env/prod.js'},
		{src: 'server/config/_test.js', dest: 'server/config/env/test.js'}
	], function(tmpl) {
		yo.template(tmpl.src, tmpl.dest, yo);
	});


	this.copy('server/libs/_crud.js', 'server/libs/crud.js');
	this.copy('server/libs/_errors.js', 'server/libs/errors.js');
	this.copy('server/libs/_mail.js', 'server/libs/mail.js');
	this.copy('server/libs/_test.js', 'server/libs/test.js');
	this.copy('server/libs/_utils.js', 'server/libs/utils.js');
	this.copy('server/libs/mail/_debug.js', 'server/libs/mail/debug.js');

	this.copy('server/_app.js', 'server/app.js');
	this.copy('server/_api.js', 'server/api.js');
};

Generator.prototype.public = function () {
	this.mkdir('public');
	this.mkdir('public/app');

	var yo = this;
	_.map([
		{src: 'public/_index.html', dest: 'public/index.html'}
	], function(tmpl) {
		yo.template(tmpl.src, tmpl.dest, yo);
	});

	this.copy('public/_config.scss', 'public/app/config.scss');
	this.copy('public/_bootstrap.scss', 'public/app/bootstrap.scss');
};


Generator.prototype.test = function () {
	this.mkdir('test');

	this.copy('test/_globals.js', 'test/globals.js');
	this.copy('test/_utils.js', 'test/utils.js');
};

Generator.prototype.install = {
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
