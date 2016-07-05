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
	}, {
		name: 'useAuth',
		type: 'confirm',
		message: 'Setup Authentication support?',
		default: true
	}, {
		name: 'useDB',
		type: 'confirm',
		message: 'Setup DB access?',
		default: true
	},{
		name: 'dbBackend',
		type: 'list',
		message: 'Choose a DB Backend',
		choices: [{
			name: 'Neo4j REST API',
			value: 'neo4jRest',
			default: true
		}, {
			name: 'Neo4j Bolt API',
			value: 'neo4jBolt',
			default: true
		}, {
			name: 'MongoDB',
			value: 'mongoose',
			default: true
		}, {
			name: 'MySQL',
			value: 'sql',
			default: true
		}],
		when: this.useDB
	}];

	// Collect all answers and save to the generator
	this.prompt(prompts, function (props) {
		_.merge(this, props);
		
		switch(props.dbBackend) {
			case 'neo4jRest':
				this.dbPackages = 'seraph seraph-model';
				this.DBAdapterPath = 'seraph';
				this.dbPort = 7474;
				this.dbProto = 'http';
				break;
			case 'neo4jBolt':
				this.dbPackages = 'neo4j-driver';
				this.DBAdapterPath = 'bolt';
				this.dbPort = 7687;
				this.dbProto = 'bolt';
				break;
			case 'mongoose':
				this.dbPackages = 'mongoose';
				this.DBAdapterPath = 'mongo';
				this.dbPort = 27017;
				this.dbProto = 'mongo';
				break;
			case 'sql':
				this.dbPackages = 'sequelize';
				this.DBAdapterPath = 'sql';
				this.dbPort = 3306;
				this.dbProto = 'tcp';
				break;
		}

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
		return this.installDependencies();
	},
	 extra: function() {
		 return this.npmInstall(this.dbPackages, {save: true})
	 }
};

Generator.prototype.end = function () {
	var done = this.async();
	spawn('npm', ['run', 'build:dev'], {
		cwd: process.cwd(),
		stdio: 'inherit'
	})
		.on('error', function (err) {
			console.error(err);
			done(err);
		})
		.on('exit', () => {
			console.log(`Run server in development mode with debug output - 'npm run dev:dbg'`);
			console.log(`Run server in production mode - 'npm start`);
			done();
		});
};
