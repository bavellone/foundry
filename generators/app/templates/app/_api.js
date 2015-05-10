var config = require('./config/config'),
	_ = require('lodash'),
	glob = require('glob'),
	path = require('path');

var routes = _.map(glob.sync('./server/app/**/app.js'), function (appPath) {
	return {
		path: path.dirname(path.resolve(appPath)).split(path.sep).pop(), // Name of module
		app: require(path.resolve(appPath)) // Module API
	};
});

module.exports = function (app) {
	// Root routing
	if (config.api.enabled) {
		_.forEach(routes, function (route) {
			var path = config.api.path + '/' + config.api.version + '/' + route.path;
			//namespace(app, path, route.app);
			route.app(app, path);
			console.log('Mounted ' + path);
		});
	}
};
