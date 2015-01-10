/**
 * This module defines a set of common CRUD routes that operate on Mongoose models
 *
 */

var errorHandler = require('errors.js'),
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
	return function(req, res) {
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
	return function(req, res) {
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
	return function (req, res) {
		fn(req, res);
		// Create the new model with the POST data
		var model = ops.cb(new model(req.body));

		// Validate the new model
		model.validate(errorHandler.validation(res, function () {
			model.save(errorHandler.saveModel(res, function () {
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

	return function (req, res) {
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

	return function (req, res) {
		fn(req, res);
		model.remove({_id: req.params.id}, errorHandler.readModel(res, function () {
			res.json({success: true});
		}));
	}
}

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

module.exports = function (model, ops, fn) {
	if (typeof ops == 'function') {
		fn = ops;
		ops = {};
	}
	return crudAPI(express(), {
		list: list(model, ops, fn),
		read: read(model, ops, fn),
		create: create(model, ops, fn),
		update: update(model, ops, fn),
		destroy: destroy(model, ops, fn)
	});
};


//exports.emptyDB = function(req, res) {
//	var db = mongoose.connection.db;
//	db.dropCollection('equipment', function(err) {
//		if (!err) {
//			res.json({'message': 'Success!'});
//		}
//	});
//};
