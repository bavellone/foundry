var yo = require('yeoman-generator'),
	path = require('path'),
	_ = require('lodash'),
	chalk = require('chalk');

module.exports = yo.generators.NamedBase.extend({
	prompting: function () {
		var done = this.async();

		var prompts = [{
			name: 'modURL',
			message: 'Base URL?',
			default: this.name
		}, {
			name: 'modState',
			message: 'Base state?',
			default: 'index'
		}];

		this.prompt(prompts, function (props) {
			this.modName = this.name;
			this.modURL = props.modURL;
			this.modState = props.modState;
			done();
		}.bind(this));
	},
	skeleton: function () {
		this.mkdir('public/app/'+this.name);
	},
	scaffold: function () {
		var templates = [
			{src: '_app.js', dest: 'app.js'},
			{src: '_config.js', dest: 'config.js'},
			{src: '_ctrl.js', dest: 'ctrl.js'},
			{src: '_home.html', dest: 'home.html'}
		],
			yo = this;

		_.map(templates, function (tmpl) {
			var destPath = './public/app/'+ yo.name +'/'+tmpl.dest;
			yo.template(tmpl.src, destPath, yo);
		});
	}
});
