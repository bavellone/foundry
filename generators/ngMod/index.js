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
		message: 'Set up routes for this module?',
		default: this.useRouter
	}, {
		name: 'modURL',
		message: 'URL of the module?',
		when: function (ops) {
			return ops.useRouter
		},
		default: this.modURL
	}];

	this.prompt(prompts, function (props) {
		this.modName = props.modName;
		this.modURL = props.modURL;
		this.useRouter = props.useRouter;
		done();
	}.bind(this));
};

Generator.prototype.skeleton = function () {
	this.mkdir('public/modules/'+this.modName);
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
		deps = [
			'<%= modName %>.service'
		],
		routeDeps = [
			'<%= modName %>.config',
			'<%= modName %>.ctrl',
			'ui.bootstrap'
		],
		yo = this;



	if (this.useRouter) {
		templates = templates.concat(routes);
		deps = deps.concat(routeDeps);
	}

	this.depStr = _.map(deps, function (dep) {
		return '\'' + _.template(dep, yo) + '\'';
	}).join(', ');

	_.map(templates, function (tmpl) {
		var destPath = path.join('./public/modules/', yo.modName, '/'+tmpl.dest);
		yo.template(tmpl.src, destPath, yo);
	});

	this.copy('_styles.scss', './public/modules/'+ yo.modName + '/styles.scss');
};
