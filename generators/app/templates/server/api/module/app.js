/*eslint-env node*/
var express = require('express'),
	errors = require('../../libs/errors'),
	_ = require('lodash');

import api from './api';
import model from './model';

module.exports = App;

function App() {
	// Create the API router
	var API = express.Router();
	
	// Attach routes
	// ...

	// Return the main app
	return API;
}

App.api = api;
App.model = model;
