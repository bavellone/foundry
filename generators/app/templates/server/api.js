/*eslint-env node*/
import Q from 'q';
import _ from 'lodash';
import modules from './api/';
const	debug = require('debug')('app:api');

module.exports = function (app) {
	var basePath = app.locals.config.api.path + '/';

	if (app.locals.config.enable.api)
		return Q.resolve().then(() => {
			app.locals.api = {};
			app.locals.apiPath = basePath;

			_.map(modules, function (module) {
				app.use(basePath + module.name, module.app());
				app.locals.api[module.name] = basePath + module.name;

				debug(`Initialized ${module.name}API...`);
			});

		}, err => debug(err));
	else
		return debug('API disabled!') || Q.resolve();
};

