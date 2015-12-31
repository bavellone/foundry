/*eslint-env node*/
var express = require('express'),
	errors = require('../../libs/errors'),
	_ = require('lodash');

import {list, create, read, update, destroy} from './api';

module.exports = function UserModule() {
	// Create the API router
	var API = express.Router();

	// Attach routes
	API.get('/', list);
	API.post('/', create);
	API.get('/:id', read);
	API.put('/:id', update);
	API.delete('/:id', destroy);

	// Return the main app
	return API;
};
