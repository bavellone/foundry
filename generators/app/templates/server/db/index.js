/*eslint-env node*/
'use strict';

import debug from 'debug';
import Q from 'q';

import {wrap, DBConnectionError} from './../libs/errors';

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
	_connection = null;
	connected = null;
	connecting = false;
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
		this.refreshConnection();
	};

	refreshConnection() {
		this.connecting = false;
		this._connection = Q.defer();
		this.connected = this._connection.promise;
	};

	/**
	 * Attempt to establish a connection to the database
	 */
	connect = (ops = {poll: 1, timeout: 1000}) => {
		// Skip connecting if we are already connecting
		if (this.connecting)
			return dbg('Already connecting to DB') || this.connected;

		// Skip connecting if we are already connected
		if (Q.isFulfilled(this.connected))
			return dbg('Already connected to DB') || this.connected;

		this.connecting = true;
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

				if (this.connectionAttempts++ % 4 == 3)
					ops.poll *= 2;

				dbg(`Retrying in ${ops.poll}s`);
				return Q.Promise(resolve => {
					setTimeout(() => {
						this.refreshConnection();
						resolve(this.connect(ops))
					}, ops.poll * ops.timeout);
				});
			})
			.finally(() => this.connecting = false);
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
		this.adapter.registerSchema(this, schema, label).then(model => {
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
		).catch(err => {
			if (wrap(err) instanceof DBConnectionError)
				this.refreshConnection() || this.connect();
			return Q.reject(err);
		});
}
