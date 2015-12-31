/*eslint-env node*/
var config = require('./config'),
	_ = require('lodash'),
	debug = require('debug')('app:api'),
	utils = require('./libs/utils');

var modules = require('./api/modules');

var basePath = config.api.path + '/';

module.exports = function (app) {
	if (config.enable.api) {
		debug('Initializing API...');
		app.locals.api = {};
		app.locals.apiPath = basePath;
		
		_.map(modules, function (module) {
			app.use(basePath + module.name, module.app());
			app.locals.api[module.name] = basePath + module.name;
		});

		app.all(basePath, (req, res) => {
			res.status(404);
		});
		
		debug('API initialized!');
	}
	else
		debug('API disabled!');
};

