'use strict';

var _ = require('lodash'),
	util = require('util'),
	debug = require('debug')('app:lib:error');

/**
 * Get unique error field name
 */
function getUniqueErrorField(err) {
	var output;

	try {
		output = err.err.substring(err.err.lastIndexOf('.$') + 2, err.err.lastIndexOf('_1'));

	} catch (ex) {
		output = 'Field';
	}

	return output;
}

/**
 * Get the error message from error object
 */
module.exports.getModelError = function(err) {
	if (err.code) {
		if (err.code == 11001 || err.code == 11000) {
			return exports.errors.modelDup(getUniqueErrorField(err));
		}
	}
	else
		return new BaseError(400, 'Unknown Error', err.errors);
};

/**
 * Get the error message from error object
 */
module.exports.getValidationError = function(err) {
	return _.map(err.errors, function(error) {
		return {
			field: error.path,
			type: error.type
		};
	})
};

/**
 * Converts an error into an application error
 * @param err
 */
var wrap = function(err) {
	if (err.name == 'ValidationError') {

		if (err.errors) {
			var e = _.values(err.errors);
			return module.exports.errors.validationError(e[0].path, e[0].type);
		}
		return module.exports.errors.validationError(err.path, err.type);
	}
	else if (err.name == 'MongoError') {
		return module.exports.getModelError(err);
	}
	else {
		console.error('UNKNOWN ERROR');
		console.error(err);
		console.error(err.stack);
		return err;
	}
};

module.exports.saveCB = function(next, cb) {
	return function(err, data) {
		if (err) {
			debug('Save Error!');
			return next(wrap(err));
		}
		return cb(data);
	}
};

function BaseError(code, name, desc) {
	if (!(this instanceof module.exports.BaseError))
		return new BaseError(code, name, desc);

	var self = this;
	if (_.isObject(code)) {
		_.map(code, function(val, key) {
			self[key] = val;
		});
	}
	else {
		this.code = code;
		this.name = name;
		this.desc = desc;
	}
	//debug("New error:", this.code, this.name, this.desc);

	this.code = this.code || 500;
	this.name = this.name || '';
	this.desc = this.desc || [];
}

util.inherits(BaseError, Error);
BaseError.prototype.name = 'BaseError';

module.exports.BaseError = BaseError;

module.exports.errors = {
	error: function(code, name, desc) {
		return new BaseError(code, name, desc)
	},
	400: function(name, desc) { // Bad Request
		return this.error(400, name, desc)
	},
	401: function(name, desc) { // Unauthorized
		return this.error(401, name, desc)
	},
	permissionDenied: function(desc) {
		return this[401]('Permission denied', desc)
	},
	authDenied: function(desc) {
		return this[401]('Authentication Denied', desc)
	},
	reqAdmin: function() {
		return this.permissionDenied('Requires Admin Privileges')
	},
	reqUser: function() {
		return this.permissionDenied('Must be logged in')
	},
	reqTech: function() {
		return this.permissionDenied('Must be a Technician')
	},
	signupDisabled: function() {
		return this[401]('Signup disabled', 'Signup has been disabled!')
	},
	authFailed: function() {
		return this[401]('Authentication failed', 'Invalid Email/Password!')
	},
	modelDup: function(field) {
		return this[400]('Model Duplicate', field + ' already exists!')
	},
	validationError: function(path, type) {
		return this[400]('Invalid/Missing Data', path + ' is ' + type + '!')
	}
};


module.exports.catchAll = function catchAll(err, req, res, next) {
	if (err instanceof BaseError) {
		debug('Caught Application Error');
		debug(err.name + ': ' + err.desc);
	}
	else {
		debug('Caught error');
		debug(err.toString());
		debug(err.stack);
	}

	res.status(err.code || 500);

	var whitelist = ['code', 'name', 'desc', 'data'];

	res.json(_.reduce(err, function(response, val, key) {
		if (val && _.includes(whitelist, key))
			response[key] = val;
		return response;
	}, {}))
};
