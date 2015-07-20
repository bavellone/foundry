var path = require('path'),
	_ = require('lodash'),
	config = require('./config/config'),
	chalk = require('chalk'),
	mongoose = require('mongoose'),
	express = require('express'),
	bodyParser = require('body-parser'),
	http = require('http'),
	debug = require('debug')('app:init'),
	debugMongo = require('debug')('app:mongo'),
	errors = require('./libs/errors'),
	utils = require('./libs/utils');

// Import models
utils.globMap('./server/api/**/model.js', function(paths) {
	require(paths.full);
});

module.exports = function() {
	var app = express();
	app.db = mongoose.connect(config.db, function(err) {
		if (err) {
			debugMongo(chalk.red('Could not connect to MongoDB!'));
			debugMongo(chalk.red(err));
		}
		else
			debugMongo('Connected to MongoDB: ' + chalk.green(config.db));
	});

	http.globalAgent.maxSockets = config.connectionPool;

	// Setting the app router and static folder
	app.use(express.static(path.resolve('./public/assets')));

	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({
		extended: true
	}));

	// Initialize API
	require('./api.js')(app);

	app.all('/*', function(req, res) {
		res.sendFile(path.resolve('./public/assets/index.html'));
	});

	// Error handling
	app.use(errors.catchAll);

	debug('App initialized!');

	return app;
};
