/**
 * The Schema class provides an interface to validate the data of a model
 */

/*eslint-env node browser*/
'use strict';

import q from 'q';
import omit from 'lodash/omit';

import debug from 'debug';
const dbg = debug('app:schema');

export default class Schema {
	constructor(data = {}) {
		this.data = data;
	}
	data = {};
	static constraints = {};
	static blacklist = [];
  static defaultValidationOps = {
    stripUnknown: true,
    context: {
      omit: false
    }
  };

	static validate(data = {}, constraints = {}, ops = {}) {
    return q.Promise((resolve, reject) => {
      dbg('validating');
      constraints.validate(data, {...Schema.defaultValidationOps, ...ops}, (err, val) => {
        dbg('validated');
        if (err)
          return reject(err);
        return resolve(val);
      })
    }).then(data => dbg('valiation done') || data)
	}
	validate(ops = {}) {
		return Schema.validate(this.data, this.constructor.constraints, ops).then(data => dbg('post-validate') || data);
	}
	validateCreate(ops) {
		return this.validate(this.constructor.validationSettings ? this.constructor.validationSettings.create : {}).then(data => dbg('post-validateCreate') || data)
	}

	static toJSON(data, blacklist) {
		return data;
	}
	toJSON() {
		return Schema.toJSON(this.data, this.contructor.blacklist);
	}
}
