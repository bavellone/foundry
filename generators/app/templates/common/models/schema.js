/**
 * The Schema class provides an interface to validate the data of a model
 */

/*eslint-env node browser*/
'use strict';

import q from 'q';
import _ from 'lodash';
import _validate from 'validate.js';

export default class Schema {
	constructor(data = {}) {
		this.data = data;
	}
	data = {};
	constraints = {};
	blacklist = [];

	static validate(data = {}, constraints = {}, ops = {}) {
		let err;

		if (err = _validate(data, constraints, ops))
			return q.reject(err);
		else
			return q.resolve(data);
	}

	validate(ops = {}) {
		return Schema.validate(this.data, this.constraints, ops)
	}

	static toJSON(data, blacklist) {
		return _.omit(data, blacklist)
	}

	toJSON() {
		return Schema.toJSON(this.data, this.blacklist)
	}
}
