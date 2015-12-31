/*eslint-env node*/
'use strict';

import _ from 'lodash';
import debug from 'debug';
import errors from './libs/errors.js';
import q from 'q';
import chalk from 'chalk';
import seraph from 'seraph';
import seraphModel from 'seraph-model';

const config = require('./config');

/**
 *
 * DB Module Setup
 *
 */

let dbg = debug('app:db');

export default class DB {
	static db = seraph(config.db);
	static models = [];
	static registerSchema = (schema, label) => {
		dbg(`Registering new Schema: ${label}`);

		// Create seraph model instance and attach to schema
		let model = seraphModel(DB.db, label);
		schema.model = model;
		model.type = schema.type;

		DB.models.push({model, schema, label});

		return schema;
	};
}
