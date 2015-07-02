var config = require('./config/config'),
	_ = require('lodash'),
	glob = require('glob'),
	path = require('path'),
	chalk = require('chalk'),
	debug = require('debug')('app:api'),
	utils = require('./libs/utils');


var routes = utils.globMap('./server/app/**/app.js', function(paths) {
	return {
		name: path.dirname(paths.full).split(path.sep).pop(), // Name of module
		app: require(paths.full) // Module API
	};
});

var basePath = config.api.path + '/' + config.api.version;

module.exports = function(app) {
	if (config.enable.api) {
		debug('Initializing API...');
		app.locals.apiPath = basePath;
		_.each(routes, function(route) {
			route.app(app, basePath + '/' + route.name);
		});
		debug('API initialized!');
	}
	else
		debug('API disabled!');
};

