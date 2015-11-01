/*eslint-env node*/
'use strict';

var _ = require('lodash'),
		util = require('util'),
		debug = require('debug')('app:lib:error');

/**
 * Converts an error into an application error
 * @param err
 */
var wrap = function (err) {
	if (err.code == 'Neo.ClientError.Schema.ConstraintViolation')
		return new Neo4jDuplicate(err.message);
	else {
		console.error('UNKNOWN ERROR');
		console.error(err);
		console.error(err.stack);
		return err;
	}
};

module.exports.wrap = wrap;

module.exports.saveCB = function (next, cb) {
	return function (err, data) {
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
		_.map(code, function (val, key) {
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
	error: function (code, name, desc) {
		return new BaseError(code, name, desc)
	},
	400: function (name, desc) { // Bad Request
		return this.error(400, name, desc)
	},
	401: function (name, desc) { // Unauthorized
		return this.error(401, name, desc)
	},
	permissionDenied: function (desc) {
		return this[401]('Permission denied', desc)
	},
	authDenied: function (desc) {
		return this[401]('Authentication Denied', desc)
	},
	reqAdmin: function () {
		return this.permissionDenied('Requires Admin Privileges')
	},
	reqUser: function () {
		return this.permissionDenied('Must be logged in')
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

	res.json(_.reduce(err, function (response, val, key) {
		if (val && _.includes(whitelist, key))
			response[key] = val;
		return response;
	}, {}))
};


let Neo4jError = function (msg) {
	Error.captureStackTrace(this, this.constructor);
	this.name = this.constructor.name;
	this.message = msg;
};

util.inherits(Neo4jError, BaseError);

let Neo4jDuplicate = function (msg) {
	Error.captureStackTrace(this, this.constructor);
	this.name = this.constructor.name;
	this.message = msg;
};

util.inherits(Neo4jDuplicate, BaseError);

module.exports.Neo4jError = Neo4jError;
module.exports.Neo4jDuplicate = Neo4jDuplicate;
