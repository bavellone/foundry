/*eslint-env node*/
'use strict';

import q from 'q';

import User from './model';
import {ValidationError, wrap} from '../../libs/errors';

export function list(req, res, next) {
	q.ninvoke(User.model, 'findAll')
			.then(data => res.json(data))
			.catch(err => next(wrap(err)))
}

export function create(req, res, next) {
	User.validate(req.body)
			.catch(err => next(new ValidationError(err)))
			.then(() => q.ninvoke(User.model, 'save', req.body))
			.catch(err => next(wrap(err)))
			.then(() => res.status(200).send())
}

export function read(req, res, next) {
	q.ninvoke(User.model, 'read', req.params.id)
		.then(data => res.json(data))
		.catch(err => next(wrap(err)))
}

export function update(req, res, next) {
	next();
}

export function destroy(req, res, next) {
	next();
}
