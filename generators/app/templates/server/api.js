var config = require('./config'),
	_ = require('lodash'),
	path = require('path'),
	debug = require('debug')('app:api'),
	utils = require('./libs/utils');


var routes = utils.globMap('./server/api/**/api.js', function(paths) {
	return {
		name: path.dirname(paths.full).split(path.sep).pop(), // Name of module
		app: require(paths.full) // Module API
	};
});

var basePath = config.api.path + '/' + config.api.version + '/';

module.exports = function(app) {
	app.locals.api = {};
	if (config.enable.api) {
		debug('Initializing API...');
		app.locals.apiPath = basePath;
		_.each(routes, function (route) {
			app.use(basePath + route.name, route.app());
			app.locals.api[route.name] = basePath + route.name;
		});
		debug('API initialized!');
	}
	else
		debug('API disabled!');
};

