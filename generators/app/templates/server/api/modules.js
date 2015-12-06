/*eslint-env node*/
'use strict';

var path = require('path'),
	utils = require('../libs/utils');


module.exports = utils.globMap('./server/api/*/', function (paths) {
	var app = require(paths.full + path.sep + 'app.js');

	return {
		name: paths.file, // Name of module
		app, // Express Router object
		api: app.api, // API for this module
		model: app.model // Model for this module
	};
});
