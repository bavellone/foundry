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
	
	// Get rid of express header
	app.set('x-powered-by', false);
	
	// Use IP address from HAProxy X-Forwarded-For header
	app.set('trust proxy', true);
	
	app.db = db;
	
	http.globalAgent.maxSockets = config.connectionPool;
	
	// Serve app shell when root is requested
	app.use('/', express.static(path.resolve('./public/assets/')));
	
	// Setting the app router and static folder
	app.use('/assets', express.static(path.resolve('./public/assets')));
	
	// Setup parsers
	app.use(bodyParser.json());
	
	app.use((err, req, res, next) => {
		res.status(400).send('Malformed Request');
	});
	
	app.use(bodyParser.urlencoded({
		extended: true
	}));
	
	// Initialize API
	require('./api.js')(app);
	
	// Send 404 for any requests that don't match API or static routes
	app.use((req, res) => {
		res.status(404).send('Not Found');
	});
	
	// Error handling
	app.use(errors.catchAll);
	
	debug('App initialized!');
	
	return app;
};
