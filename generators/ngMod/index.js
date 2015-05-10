var yo = require('yeoman-generator'),
	path = require('path'),
	_ = require('lodash'),
	chalk = require('chalk'),
	util = require('util');

var Generator = module.exports = function Generator(args, options) {
	yo.generators.Base.apply(this, arguments);

	this.modName = this.options.modName || '';
	this.modURL = this.options.modURL || '';
	this.useRouter = this.options.useRouter || true;
	this.skipPrompts = this.options.skipPrompts || false;
};
util.inherits(Generator, yo.generators.Base);


Generator.prototype.prompting = function () {
	var done = this.async();

	var prompts = [{
		name: 'modName',
		message: 'Name of the module?',
		default: this.modName
	}, {
		name: 'useRouter',
		type: 'confirm',
		message: 'Set up routes for this module? (Deprecated)',
		default: this.useRouter
	}, {
		name: 'modURL',
		message: 'URL of the module?',
		when: function (ops) {
			return ops.useRouter
		},
		default: this.modURL
	}];

	if (!this.skipPrompts) {
		this.prompt(prompts, function (props) {
			this.modName = props.modName;
			this.modURL = props.modURL;
			this.useRouter = props.useRouter;
			done();
		}.bind(this));
	}
	else
		done();
};

Generator.prototype.skeleton = function () {
	this.mkdir('public/app/'+this.modName);
};

Generator.prototype.scaffold = function () {
	var templates = [
		{src: '_app.js', dest: 'app.js'},
		{src: '_service.js', dest: 'service.js'}
	],
		routes = [
			{src: '_config.js', dest: 'config.js'},
			{src: '_ctrl.js', dest: 'ctrl.js'},
			{src: '_index.html', dest: 'index.html'}
		],
		yo = this;



	if (this.useRouter || true) // Deprecated
		templates = templates.concat(routes);

	_.map(templates, function (tmpl) {
		var destPath = path.join('public/app/', yo.modName, '/'+tmpl.dest);
		yo.template(tmpl.src, destPath, yo);
	});

	this.copy('_styles.scss', 'public/app/'+ yo.modName + '/styles.scss');
};
