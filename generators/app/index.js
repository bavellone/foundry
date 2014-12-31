var yo = require('yeoman-generator'),
	path = require('path'),
	_ = require('lodash');

module.exports = yo.generators.Base.extend({
	prompt: function () {
		var done = this.async();

		console.log(this.yeoman);

		var prompts = [{
			name: 'appName',
			message: 'What is the name of this app?'
		}];

		this.prompt(prompts, function (props) {
			this.appName = props.appName;
			console.log(props);
			done();
			console.log('Got prompts');
		}.bind(this));
	},
	skeleton: function () {
		console.log('Building');

		this.mkdir('public');
		this.mkdir('public/app');
		this.mkdir('public/assets');
		this.mkdir('public/assets/css');
		this.mkdir('public/assets/fonts');
		this.mkdir('public/assets/js');
	},
	scaffold: function () {
		var yo = this,
			ctx = {
				appName: this.appName
			};

		_.map([
			{src: '_bower.json', dest: 'bower.json'},
			{src: '_gulpfile.js', dest: 'gulpfile.js'},
			{src: '_index.html', dest: 'app/index.html'},
			{src: '_package.json', dest: 'package.json'},
			{src: '_server.js', dest: 'server.js'}
		], function (tmpl) {
			yo.template(tmpl.src, tmpl.dest, ctx);
		});

		this.copy('_.gitignore', '.gitignore');
	},
	install: function () {
		var done = this.async(),
			yo = this;

		this.installDependencies(function () {
			// Copy bootstrap fonts
			yo.copy('', '');
			console.log('Setup complete!');
			done();
		})
	}
});
