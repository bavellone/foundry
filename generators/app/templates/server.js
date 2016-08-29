/*eslint-env node*/
require('babel-core/register')();

const chalk = require('chalk');
const config = require('./server/config');
const debug = require('debug')('app:server');
const fs = require('fs');
const util = require('util');
const Q = require('q');

Q.longStackSupport = (process.env.NODE_ENV == 'development');

// Write PID to file
fs.writeFile('server.pid', process.pid, (err) => {
	if (err)
		console.error('Error writing PID file!')
});

/**
 * App Setup
 */
const app = module.exports = require('./server/app.js')(config);
let server;

app.ready.then(() => {
	if (config.interface)
		server = app.listen(config.port, config.interface, onListen);
	else
		server = app.listen(config.port, onListen);
});

/**
 * Signal Handler definitions
 */

function onListen() {
	debug(`${chalk.blue(config.app.title)} listening on port ${chalk.blue(config.port)} in ${chalk.blue(process.env.NODE_ENV || 'development')} mode`);
}

function shutdown() {
	debug("Shutting down gracefully.");
	server.close(() => {
		debug("Closed out remaining connections.");
		process.exit()
	});

	// if after 
	setTimeout(() => {
		debug("Could not close connections before timeout, forcefully shutting down");
		process.exit()
	}, 10 * 1000);
}

process.on('uncaughtException', err => {
	console.error(chalk.red('Caught unhandled exception!'));
	console.error(err);
	throw err;
});

/**
 * Signal Handling
 */

process.on('SIGINT', () => {
	debug('Got SIGINT');
	shutdown()
});

// SIGUSR2 is used by nodemon to restart the app, only bind in production
if (process.env.NODE_ENV == 'production')
	process.on('SIGUSR2', () => {
		debug('Got SIGUSR2, shutting down gracefully!');
		shutdown();
	});

process.on('SIGPIPE', () => {
	debug('Got SIGPIPE');

	console.log(util.inspect(process.memoryUsage()));
});
