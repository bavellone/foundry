var yo = require('yeoman-generator'),
	_ = require('lodash'),
	chalk = require('chalk'),
	spawn = require('child_process').spawn,
	util = require('util');

const opensslGenRSA = 'openssl genrsa | tee config/token.key | openssl rsa -pubout > config/token.pub';

// Initialize the generator
var Generator = module.exports = function Generator(args, options) {
	yo.generators.Base.apply(this, arguments);
};
util.inherits(Generator, yo.generators.Base);

// Prompt for some information about this app
Generator.prototype.prompting =  function () {
	var done = this.async();

	var prompts = [{
		name: 'appName',
		message: 'App name:',
		default: this.appname.charAt(0).toUpperCase() + this.appname.substr(1)
	}, {
		name: 'appNS',
		message: 'App namespace (short, simple & unique):',
		default: this.appname
	}, {
		name: 'appDesc',
		message: 'App description:',
		default: ''
	}];

	// Collect all answers and save to the generator
	this.prompt(prompts, function (props) {
		this.appName = props.appName;
		this.appNS = props.appNS;
		this.appDesc = props.appDesc;
		done();
	}.bind(this));
};

// Copy and template all files
Generator.prototype.initApp = function () {
	var done = this.async();
	this.directory('./');
	this.mkdir('data');
	this.mkdir('config');
	
	spawn('sh', ['-c', opensslGenRSA], {
		cwd: process.cwd()
	})
		.on('error', function (err) {
			console.log(err);
			done(err);
		})
		.on('exit', done);
};

Generator.prototype.install = {
	deps: function () {
		this.installDependencies();
	}
};

Generator.prototype.end = function () {
	console.log(chalk.green('Almost done! Run "npm run build:dev" to complete installation'));
};
