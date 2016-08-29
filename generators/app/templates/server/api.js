/*eslint-env node*/
import Q from 'q';
import _ from 'lodash';
import modules from './api/';
const	debug = require('debug')('app:api');

module.exports = function (app) {
	var basePath = app.locals.config.api.path + '/';

	if (app.locals.config.api.enable) {
		app.locals.api = {};
		app.locals.apiPath = basePath;

		return Q.all(_.map(modules, function (module) {
			return require(module.app)(app)
				.then(API => {
					app.use(basePath + module.name, API);
					app.locals.api[module.name] = basePath + module.name;
					debug(`Initialized ${module.name}API...`);
				})
		}), debug)
      .then(() => app.db.models);
	}
	else
		return debug('API disabled!') || Q.resolve([]);
};
