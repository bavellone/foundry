/*eslint-env node*/
/**
 * This module defines a set of common CRUD routes 
 */
	
import express from 'express';
import debug from 'debug';
import {wrap, return404} from './../libs/errors';
import {ensureParamID} from './../libs/utils';

let dbgCRUD = debug('app:db:crud');

export default function(modelAPI) {
	let app = express.Router();
	let crud = CRUDAPI(modelAPI);

	// Attach routes
	app.get('/', crud.list);
	app.post('/', crud.create);
	app.delete('/', crud.destroyAll);
	app.get('/:id', ensureParamID(), crud.read);
	app.put('/:id', ensureParamID(), crud.update);
	app.delete('/:id', ensureParamID(), crud.destroy);

	app.use((req, res, next) =>
		dbgCRUD(`404`) || return404(req, res)
	);

	return app;
}

function CRUDAPI(api) {
	return {
		list: (req, res, next) =>
		dbgCRUD(`listing ${api.schema.type}s`) ||
		api.list()
			.done(::res.json, err => next(wrap(err))),

		create: (req, res, next) =>
		dbgCRUD(`creating ${api.schema.type}`) ||
		api.create(req.body)
			.done(::res.json, err => next(wrap(err))),

		read: (req, res, next) =>
		dbgCRUD(`reading ${api.schema.type}:${req.params.id}`) ||
		api.read(req.params.id)
			.done(::res.json, err => next(wrap(err))),

		update: (req, res, next) =>
		dbgCRUD(`updating ${api.schema.type}:${req.params.id}`) ||
		api.update(req.params.id, req.body)
			.done(::res.json, err => next(wrap(err))),

		destroy: (req, res, next) =>
		dbgCRUD(`deleting ${api.schema.type}:${req.params.id}`) ||
		api.destroy(req.params.id)
			.done(() => res.status(200).send(), err => next(wrap(err))),

		destroyAll: (req, res, next) =>
		dbgCRUD(`deleting all ${api.schema.type}s`) ||
		api.destroyAll()
			.done(() => res.status(200).send(), err => next(wrap(err)))
	}
}