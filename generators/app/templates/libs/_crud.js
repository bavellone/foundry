/**
 * This module defines a set of common CRUD routes that operate on Mongoose models
 *
 */

var errorHandler = require('./errors'),
	_ = require('lodash'),
	express = require('express');

/**
 * Returns a function that will respond to requests with a list of all the documents
 * defined by the given model.
 *
 * @param model
 * @param ops
 * @returns {Function}
 * @param fn
 */
function list(model, ops, fn) {
	if (typeof ops == 'function') {
		fn = ops;
		ops = {};
	}
	// Defaults
	_.defaults(ops, {
		// sort is a string which defines the sort order of the returned documents
		sort: '-created'
	});
	return function list(req, res) {
		fn(req, res);
		model.find().sort(ops.sort).exec(errorHandler.readModel(res, function (docs) {
			res.json(docs);
		}));
	};
}


/**
 * Returns a function that will respond to requests with a single document identified by
 * the _id parameter
 *
 * @param model
 * @param ops
 * @returns {Function}
 * @param fn
 */
function read(model, ops, fn) {
	if (typeof ops == 'function') {
		fn = ops;
		ops = {};
	}
	// Defaults
	_.defaults(ops, {
		// sort is a string which defines the sort order of the returned documents
		sort: '-created'
	});
	return function read(req, res) {
		fn(req, res);
		model.findById(req.params.id, errorHandler.readModel(res, function (doc) {
			res.json(doc);
		}));
	};
}

/**
 * Returns a function which creates the given model from POST data in the request.
 *
 * @param model
 * @param ops
 * @returns {Function}
 * @param fn
 */
function create(model, ops, fn) {
	if (typeof ops == 'function') {
		fn = ops;
		ops = {};
	}
	// Defaults
	_.defaults(ops, {
		// cb is a function which accepts, transforms and returns the newly created model
		// prior to validation
		cb: function(model) {return model}
	});
	return function create(req, res) {
		fn(req, res);
		// Create the new model with the POST data
		var Model = ops.cb(new model(req.body));

		// Validate the new model
		Model.validate(errorHandler.validation(res, function () {
			Model.save(errorHandler.saveModel(res, function () {
				res.json({success: true});
			}));
		}));
	}
}

/**
 * Returns a function which updates a document with the POST data in the request. The
 * document's _id must be sent along with the POST data or the request will be rejected.
 *
 * @param model
 * @param ops
 * @param fn
 */
function update(model, ops, fn) {
	if (typeof ops == 'function') {
		fn = ops;
		ops = {};
	}
	// Defaults
	_.defaults(ops, {

	});

	return function update(req, res) {
		fn(req, res);
		model.findById(req.params.id, errorHandler.readModel(res, function (doc) {
			// Update the model
			_.forEach(req.body, function (key, val) {
				doc[key] = val;
			});
			// Validate the new model data
			doc.validate(errorHandler.validation(res, function () {
				doc.save(errorHandler.saveModel(res, function () {
					res.json({success: true});
				}));
			}));
		}));
	}
}

/**
 * Returns a function which removes a document given by the _id POST parameter.
 *
 * @param model
 * @param ops
 * @param fn
 */
function destroy(model, ops, fn) {
	if (typeof ops == 'function') {
		fn = ops;
		ops = {};
	}
	// Defaults
	_.defaults(ops, {

	});

	return function destroy(req, res) {
		fn(req, res);
		model.remove({_id: req.params.id}, errorHandler.readModel(res, function () {
			res.json({success: true});
		}));
	}
}

/**
 * Returns a function that empties a collection
 * @param model
 * @param ops
 * @param fn
 * @returns {Function}
 */
function emptyDB(model, ops, fn) {
	if (typeof ops == 'function') {
		fn = ops;
		ops = {};
	}
	// Defaults
	_.defaults(ops, {

	});

	return function (req, res) {
		fn(req, res);
		model.db.dropCollection(model.collection.name, errorHandler.validation(res));
	}
}

/**
 * Accepts and express-like app, and an api object akin to the one returned by buildAPI()
 *
 * @param app
 * @param api
 * @returns {*}
 */
function crudAPI(app, api) {
	app.route('/')
		.get(api.list)
		.post(api.create);

	app.route('/:id')
		.get(api.read)
		.post(api.update)
		.delete(api.destroy);

	return app;
}


/**
 *  Returns an object with a REST-ful API attached
 *
 * @param model
 * @param ops
 * @param fn
 * @returns {{list: Function, read: Function, create: Function, update: Function, destroy: Function}}
 */
function buildAPI(model, ops) {
	ops = _.defaults({
		list: function () {},
		read: function () {},
		create: function () {},
		update: function () {},
		destroy: function () {}
	}, ops);
	return {
		list: list(model, ops, ops.list),
		read: read(model, ops, ops.read),
		create: create(model, ops, ops.create),
		update: update(model, ops, ops.update),
		destroy: destroy(model, ops, ops.destroy)
	};
}



module.exports = function (model, ops) {
	// Build the API object
	var api = buildAPI(model, ops);

	// Create the micro-app
	var app = express.Router();

	// Attach the CRUD interface
	return crudAPI(app, api);
};
