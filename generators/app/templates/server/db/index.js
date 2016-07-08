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
	connected = this._connection.promise;
	models = [];
	adapter = null;
	connectionAttempts = 0;

	/**
	 * Pass in an adapter instance which will be used to handle interacting with DB driver
	 * 
	 * @param adapter
	 */
	constructor({adapter}) {
		this.adapter = adapter;
	}

	/**
	 * Attempt to establish a connection to the database
	 */
	connect = (ops = {poll: 15}) => {
		// Skip connecting if we are already connected
		if (Q.isFulfilled(this.connected))
			return dbg('Already connected to DB') || this.connected;

		dbg(`Connecting to DB: ${this.adapter.uri}`);
		return this.adapter.ping()
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
			.catch(err => {
				dbg(err);
				dbg(`Retrying in ${ops.poll}s`);
				
				if (this.connectionAttempts++ % 4 == 3)
					ops.poll *= 2;

				return Q.Promise(resolve => {
					setTimeout(() => {
						resolve(this.connect(ops))
					}, ops.poll * 1000);
				});
			});
	};
	
	disconnect = () =>
		this.connected.then(db =>
			this.adapter.disconnect(db)
		);
	
	/**
	 * Provide a Schema object and a label to identify the model
	 * 
	 * @param schema
	 * @param label
	 * @returns {*}
	 */
	registerSchema = (schema, label) => 
		this.connected.then(db => {
			return this.adapter.registerSchema(this, schema, label)
		}).then(model => {
			this.models.push({model, schema, label});
			return model
		});

	/**
	 * Runs the DB Bootstrap code if necessary
	 */
	bootstrap = () =>
		this.connected.then(db => adapter.bootstrap(db));

	/**
	 * Execute a query against this DB
	 * 
	 * @param queryStr
	 * @param params
	 */
	query = (queryStr, params = {}) =>
		this.connected.then(db =>
			this.adapter.query(db, queryStr, params)
		).catch(err =>
			dbg(`Query Error! ${err.toString()}`) || Q.reject(wrap(err))
		);
}
