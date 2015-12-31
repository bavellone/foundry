/**
 * The Schema class provides an interface to validate the data of a model
 */

/*eslint-env node browser*/
'use strict';

import q from 'q';
import _validate from 'validate.js';

export default class Schema {
	constructor(data = {}) {
		this.data = data;
	}
	static validate = (data = {}, ops = {}) => {
		let defer = q.defer(),
				err;
		if (err = _validate(data, this.constraints, ops))
			defer.reject(err);
		else 
			defer.resolve();
		
		return defer.promise;
	};
	constraints = {};
}
