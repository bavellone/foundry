/*eslint-env node*/
var express = require('express'),
	errors = require('../../libs/errors'),
	_ = require('lodash');

module.exports = function API(app, path) {
	// Create the API router
	var API = express.Router();

	// Attach router to main application
	app.use(path, API);

	// Return the main app
	return app;
};
