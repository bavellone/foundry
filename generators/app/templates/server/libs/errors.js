/*eslint-env node*/
'use strict';

var _ = require('lodash'),
  util = require('util'),
  debug = require('debug')('app:lib:error');

/**
 * Converts an error into an application error
 * @param err
 */
var wrap = function(err) {
  if (err instanceof BaseError)
    return err
  else if (err.code == 'Neo.ClientError.Schema.ConstraintViolation')
    return new Neo4jDuplicate(err);
  else if (err.code == 'Neo.ClientError.Statement.EntityNotFound')
    return new Neo4jNotFound(err);
  else if (err.code == 'Neo.DatabaseError.Statement.ExecutionFailure')
    return new Neo4jExecutionFailure('Query Execution Failed');
  else if (err instanceof ValidationError)
    return err;
  else if (err.code == 'ENOTFOUND' || // Neo4j connection errors
    err.code == 'ECONNREFUSED' ||
    _.includes(err, 'Database') ||
    _.includes(err, 'EPIPE'))
    return new DBConnectionError(err.toString());
  else if (err.toString().indexOf('request entity too large') !== -1) 
    return new RequestDataTooLarge(err)
  else {
    debug(err)
    debug(err.code, err.status, err.name)
    return new BaseError(err.code, 'Unknown', err.toString());
  }
};

module.exports.wrap = wrap;

module.exports.saveCB = function(next, cb) {
  return function(err, data) {
    if (err) {
      debug('Save Error!', err);
      return next(wrap(err));
    }
    return cb(data);
  }
};

function BaseError(code, name, desc) {
  if (!(this instanceof module.exports.BaseError))
    return new BaseError(code, name, desc);

  var self = this;
  if (_.isObject(code)) 
    _.map(code, function(val, key) {
      self[key] = val;
    });
  else {
    this.code = code;
    this.name = name;
    this.desc = desc;
  }
  //debug("New error:", this.code, this.name, this.desc);

  this.code = this.code || 500;
  this.name = this.name || '';
  this.desc = this.desc || '';
  this.message = this.desc;
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
  requestTooLarge: function(desc) {
    return this[400]('Request Data Too Large', desc)
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
  }
};

module.exports.return404 = function(req, res) {
  debug(`404 ${req.url}`)
  if (!res.headersSent)
    res.sendStatus(404)
      .end();
  else
    res.end();
};

module.exports.catchAll = function catchAll(err, req, res, next) {
  if (!(err instanceof BaseError))
    err = wrap(err);
  
  debug(`${err.name}: ${err.desc}`);

  if (!res.headersSent) {
    res.status(err.code >= 100 && err.code <= 500 ? err.code : 500);

    var whitelist = ['code', 'name', 'desc', 'data'];

    res.json(_.reduce(err, function(response, val, key) {
      if (val && _.includes(whitelist, key))
        response[key] = val;
      return response;
    }, {}))
  } else
    res.end();
};


let Neo4jError = function(err) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.desc = `${err.code}: ${err.message}`;
  this.code = 500;
  // debug(`Neo4J error occurred! ${this.desc}`);
};

util.inherits(Neo4jError, BaseError);

let Neo4jDuplicate = function(err) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.desc = err.message;
  this.code = 400;
  // debug('Neo4J Duplicate error occurred', this.desc);
};

util.inherits(Neo4jDuplicate, BaseError);

module.exports.Neo4jError = Neo4jError;
module.exports.Neo4jDuplicate = Neo4jDuplicate;

let Neo4jNotFound = function(err) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.desc = err.message;
  this.code = 404;
  // debug(`Neo4J Not Found error occurred! ${this.desc}`);
};

util.inherits(Neo4jNotFound, BaseError);
module.exports.Neo4jNotFound = Neo4jNotFound;

let Neo4jExecutionFailure = function(msg) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.desc = msg;
  this.code = 500;
  // debug(`Neo4J Execution error occurred: ${this.desc}`);
};

util.inherits(Neo4jExecutionFailure, BaseError);
module.exports.Neo4jExecutionFailure = Neo4jExecutionFailure;

let DBConnectionError = function(msg) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.desc = msg;
  this.code = 500;
  // debug(`Could not establish DB connection: ${this.desc}`);
};

util.inherits(DBConnectionError, BaseError);
module.exports.DBConnectionError = DBConnectionError;

let ValidationError = function(err) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.desc = err.message;
  this.code = 400;
  if (err.isJoi)
    debug(err.annotate());
};

util.inherits(ValidationError, BaseError);
module.exports.ValidationError = ValidationError;


let MissingParameterError = function(msg) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.desc = `[${msg}] is a required parameter`;
  this.code = 400;
  // debug(`Missing Parameter error occurred: ${this.desc}`);
};

util.inherits(MissingParameterError, BaseError);
module.exports.MissingParameterError = MissingParameterError;


let MissingIDError = function() {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.desc = `id must be specified`;
  this.code = 400;
  // debug(`Missing ID error occurred: ${this.desc}`);
};

util.inherits(MissingIDError, BaseError);
module.exports.MissingIDError = MissingIDError;


let AuthDenied = function(msg) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.desc = msg;
  this.code = 401;
  // debug(`Auth Denied error occurred: ${this.desc}`);
};

util.inherits(AuthDenied, BaseError);
module.exports.AuthDenied = AuthDenied;

let RequestDataTooLarge = function(err) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.desc = (err instanceof Error ? err.toString() : err);
  this.code = 413
};

util.inherits(RequestDataTooLarge, BaseError);
module.exports.RequestDataTooLarge = RequestDataTooLarge;
