/*eslint-env node*/
'use strict';
// import Q from 'q';

export default class Model {
	model = null;
	schema = null;

	constructor(model, schema) {
		this.model = model;
		this.schema = schema;
	};

	// list = () =>
	// 	Q.resolve();
	// create = (data) =>
	// 	Q.resolve();
	// read = (id, ops = {}) =>
	// 	Q.resolve();
	// update = (id, data) =>
	// 	Q.resolve();
	// destroy = (id) =>
	// 	Q.resolve();
	// destroyAll = () =>
	// 	Q.resolve();
}