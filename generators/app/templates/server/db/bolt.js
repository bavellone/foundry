/*eslint-env node*/
'use strict';

import Q from 'q';

import {ValidationError, wrap} from './../libs/errors';

export default class Bolt {
	/**
	 * Sends a request to the provided uri to probe if it is currently up. Returns a Promise that is resolved if a 200
	 * response is received and rejected otherwise
	 * @param uri
	 * @returns {Promise}
	 */
	static ping = (uri) => {
		return Q.resolve()
	};
	
	static model = (schema, ops) => {
		return new Model
	}
}

class Model {
	model = null;
	validationSettings = {
		list: {},
		create: {},
		read: {},
		update: {},
		destroy: {},
		destroyAll: {}
	};
	blacklist = [];
	toJSON = model => model;

	constructor(schema, ops) {
		this.model = model;

		if (ops.blacklist)
			this.blacklist = ops.blacklist;

		if (ops.validation)
			this.validationSettings = {...this.validationSettings, ...ops.validation};

		if (ops.toJSON)
			this.toJSON = ops.toJSON;
	};

	list = () =>
	create = (data) =>
	read = (id, ops = {}) =>
	update = (id, data) =>

	destroy = (id) =>

	destroyAll = () =>
}