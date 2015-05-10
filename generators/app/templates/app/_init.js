var glob = require('glob'),
	path = require('path'),
	_ = require('lodash'),
	config = require('./config/config'),
	chalk = require('chalk'),
	mongoose = require('mongoose'),
	express = require('express'),
	bodyParser = require('body-parser');

// Bootstrap db connection
var db = mongoose.connect(config.db, function(err) {
	if (err) {
		console.error(chalk.red('Could not connect to MongoDB!'));
		console.log(chalk.red(err));
	}
	else {
		console.log(chalk.green('Connected to MongoDB: ') + chalk.underline.grey(config.db));
	}
});


module.exports = function (app) {

	app.db = db;

	// Custom function to filter on path
	app.sieve = function (path, fn) {
		app.use(function (req, res, next) {
			if (_.contains(req.path, path))
				fn.call(this, req, res, next);
			else
				next();
		});
		return app;
	};

	// Import models
	_.map(glob.sync('./server/app/**/model.js'), function (modelPath) {
		require(path.resolve(modelPath));
	});


	app.use(bodyParser.urlencoded({
		extended: true
	}));
	app.use(bodyParser.json());


	// Setting the app router and static folder
	app.use(express.static(path.resolve('./public')));


	require('./api.js')(app);
};
