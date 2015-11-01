/*eslint-env node*/
'use strict';

import _ from 'lodash';
import debug from 'debug';
import errors from './libs/errors.js';
import config from './config';
import q from 'q';
import chalk from 'chalk';
import seraph from 'seraph';
import seraphModel from 'seraph-model';


/**
 * 
 * DB Module Setup
 * 
 */

let dbg = debug('app:db');

export default class DB {
	constructor(uri) {
		this.uri = uri;
		this.db = seraph(uri);
		
		this.models = {
			//Shape: Shape(this.db)
		};
	}
}

function Shape(db) {
	let shape = seraphModel(db, 'Shape');

	shape.schema = {
		name: {type: String, required: true},
		type: {type: String, enum: ['square', 'circle', 'triangle'], required: true},
		scale: {type: Number, min: 0, max: 10, default: 1}
	};
	
	return shape;
}
