var yo = require('yeoman-generator'),
	path = require('path'),
	_ = require('lodash'),
	chalk = require('chalk');

module.exports = yo.generators.Base.extend({
	prompting: function () {
		var done = this.async();
		console.log(this.yeoman);

		var prompts = [{
			name: 'appName',
			message: 'App name?',
			default: this.appname+'App'
		}];

		this.prompt(prompts, function (props) {
			this.appName = props.appName;
			done();
		}.bind(this));
	},
	skeleton: function () {
		this.mkdir('public');
		this.mkdir('public/app');
		this.mkdir('public/assets');
		this.mkdir('public/assets/css');
		this.mkdir('public/assets/fonts');
		this.mkdir('public/assets/js');
	},
	scaffold: function () {
		var yo = this;
		var templates = [
			{src: '_bower.json', dest: 'bower.json'},
			{src: '_gulpfile.js', dest: 'gulpfile.js'},
			{src: '_index.html', dest: 'public/index.html'},
			{src: '_package.json', dest: 'package.json'},
			{src: '_server.js', dest: 'server.js'}
		];

		_.map(templates, function (tmpl) {
			yo.template(tmpl.src, tmpl.dest, {appName: yo.appName});
		});

		this.copy('_.gitignore', '.gitignore');
	},
	install: {
		deps: function () {
			this.installDependencies();
		},
		module: function () {
			//this.invoke('foundry:ngMod core');
		}
	},
	end: function () {
		console.log(chalk.green('Running post-install...'));
		var done = this.async();
		this.spawnCommand('gulp', ['postInstall'])
			.on('close', function () {
				console.log(chalk.green(this.appName + ' ready for development!'));
				done();
			}.bind(this));
	}
});
