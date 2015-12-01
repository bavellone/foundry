/*eslint-env node*/
require('babel/register')();

var chalk = require('chalk'),
	config = require('./server/config'),
	debug = require('debug')('app:server');

var app = module.exports = require('./server/app.js')();

app.listen(config.port, function() {
	console.log(chalk.green('<%= appName %>') + ' listening on port', chalk.green(config.port), 'in ' + chalk.green(process.env.NODE_ENV || 'development') + ' mode');
});

process.on('uncaughtException', function(err) {
	console.log(chalk.red('Caught unhandled exception!'));
	throw err;
});

