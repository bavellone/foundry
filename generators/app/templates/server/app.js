/*eslint-env node*/
var path = require('path'),
		config = require('./config'),
		express = require('express'),
		bodyParser = require('body-parser'),
		http = require('http'),
		debug = require('debug')('app:init'),
		errors = require('./libs/errors');

import db from './db';

module.exports = function () {
	var app = express();
	app.disable('x-powered-by');
	app.db = new db(config.db);

	http.globalAgent.maxSockets = config.connectionPool;

	// Setting the app router and static folder
	app.use(express.static(path.resolve('./public/assets')));

	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({
		extended: true
	}));

	// Initialize API
	require('./api.js')(app);

	app.use('/fonts.gstatic*', (req, res) => {
		res.sendStatus(404);
	});

	app.all('/*', function (req, res) {
		res.sendFile(path.resolve('./public/index.html'));
	});

	// Error handling
	app.use(errors.catchAll);

	debug('App initialized!');

	return app;
};
