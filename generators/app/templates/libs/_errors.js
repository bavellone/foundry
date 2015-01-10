'use strict';

var  _ = require('lodash');

/**
 * Get unique error field name
 */
var getUniqueErrorMessage = function(err) {
	var output;

	try {
		var fieldName = err.err.substring(err.err.lastIndexOf('.$') + 2, err.err.lastIndexOf('_1'));
		output = fieldName.charAt(0).toUpperCase() + fieldName.slice(1) + ' already exists';

	} catch(ex) {
		output = 'Unique field already exists';
	}

	return output;
};

/**
 * Get the error message from error object
 */
exports.getErrorMessage = function(err) {
	var message = '';
	
	if (err.code) {
		switch (err.code) {
			case 11000:
			case 11001:
				message = getUniqueErrorMessage(err);
				break;
			default:
				message = 'Something went wrong';
		}
	} else {
		for (var errName in err.errors) {
			if (err.errors[errName].message) message = err.errors[errName].message;
		}
	}

	return message;
};

/**
 * Get the error message from error object
 */
exports.getErrorMessages = function(err) {
	return {
		errors: _.map(err.errors, function (error) {
			return {
				field: error.path,
				message: error.message,
				type: error.type
			};
		})
	};
};

exports.validation = function (res, cb) {
	return function (err) {
		if (err)
			return res.status(400).send(errorHandler.getErrorMessages(err));
		else
			cb();
	}
};

exports.readModel = function (res, cb) {
	return function (err, data) {
		if (err)
			return res.status(400).send(errorHandler.getErrorMessages(err));
		else
			cb(data);
	}
};

exports.saveModel = function (res, cb) {
	return function (err) {
		if (!err)
			res.json(err);
		else
			cb();
	}
};
