var express = require('express'),
	chalk = require('chalk'),
	config = require('./server/config/config'),
	debug = require('debug')('app:server');

var app = require('./server/app.js')();

app.listen(config.port, function() {
	debug('<%= appName %> Init complete');
	console.log('Env: ' + chalk.green(process.env.NODE_ENV));
	console.log('Listening on port: ' + chalk.green(config.port));
});

process.on('uncaughtException', function(err) {
	console.log(chalk.red('Caught unhandled exception!'));
	console.log(err);
	console.log(err.stack);
});

module.exports = app;
