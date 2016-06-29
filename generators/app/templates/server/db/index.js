/*eslint-env node*/
'use strict';

import debug from 'debug';
import Q from 'q';

import {wrap} from './../libs/errors';

/**
 *
 * DB Module Setup
 *
 */

const dbg = debug('app:db');

/**
 * Manages the DB connection and persistence. Tracks all models registered with DB.
 */
export default class DB {
	_connection = Q.defer();
	connected = DB._connection.promise;
	models = [];
	adapter = null;

	/**
	 * Pass in an adapter instance which will be used to handle interacting with DB driver
	 * 
	 * @param adapter
	 */
	constructor(adapter) {
		this.adapter = adapter;
	}

	/**
	 * Attempt to establish a connection to the database
	 */
	connect = () => {
		// Skip connecting if we are already connected
		if (Q.isFulfilled(this.connected))
			return dbg('Already connected to DB') || this.connected;

		dbg(`Connecting to DB: ${this.uri}`);
		return this.adapter.ping(this.uri)
			.then(
				() => {
					dbg(`DB connection established!`);
					this._connection.resolve(this.adapter.connect());
					return this.connected;
				},
				(err) => {
					dbg(`DB connection failed!`);
					this._connection.reject(wrap(err));
					return this.connected;
				}
			)
	};
	
	/**
	 * Provide a Schema object and a label to identify the model
	 * 
	 * @param schema
	 * @param label
	 * @returns {*}
	 */
	registerSchema = (schema, label) => 
		this.connected.then(db => {
			dbg(`Registering new Schema: ${label}`);
			return this.adapter.registerSchema(db, schema, label)
		}).then(model => {
			this.models.push({model,schema,label});
			return model
		});

	/**
	 * Runs the DB Bootstrap code if necessary
	 */
	bootstrap = () =>
		dbg('Checking if DB Bootstrap is needed') ||
		this.adapter.bootstrap();

	/**
	 * Execute a query against this DB
	 * 
	 * @param queryStr
	 * @param params
	 */
	query = (queryStr, params = {}) =>
		this.connected.then(db =>
			this.adapter.query(db, queryStr, params)
		);
}
