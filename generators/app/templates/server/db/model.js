/*eslint-env node*/
'use strict';
import Q from 'q';

export default class Model {
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

	constructor(model, ops) {
		this.model = model;

		if (ops.blacklist)
			this.blacklist = ops.blacklist;

		if (ops.validation)
			this.validationSettings = {...this.validationSettings, ...ops.validation};

		if (ops.toJSON)
			this.toJSON = ops.toJSON;
	};

	list = () =>
		Q.resolve();
	create = (data) =>
		Q.resolve();
	read = (id, ops = {}) =>
		Q.resolve();
	update = (id, data) =>
		Q.resolve();
	destroy = (id) =>
		Q.resolve();
	destroyAll = () =>
		Q.resolve();
}