/*eslint-env node*/
var express = require('express'),
	errors = require('../../libs/errors'),
	_ = require('lodash');

module.exports = function API() {
	// Create the API router
	var API = express.Router();
	
	// Attach routes
	// ...

	// Return the main app
	return API;
};
