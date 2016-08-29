/*eslint-env node*/
'use strict';

import debug from 'debug';
import Q from 'q';
import _ from 'lodash';
import net from 'net';
import url from 'url';

import {wrap, DBConnectionError} from './../libs/errors';

/**
 *
 * DB Module Setup
 *
 */

const dbg = debug('app:db');
const dbgQuery = debug('app:db:query');

/**
 * Manages the DB connection and persistence. Tracks all models registered with DB.
 */
export default class DB {
	_connection = null;
	connected = null;
	connecting = false;
	models = {};
	adapter = null;
  uri = '';
	connectionAttempts = 0;

	/**
	 * Pass in an adapter instance which will be used to handle interacting with DB driver
	 *
	 * @param adapter
	 */
	constructor({adapter, uri}) {
		this.adapter = adapter;
    this.uri = uri;
		this.refreshConnection();
	}
  
  get modelAPI() {
    return _.reduce(this.models, (rv, model) => {
      rv[model.label] = model.model;
      return rv;
    }, [])
  }

	refreshConnection() {
		this.connecting = false;
		this._connection = Q.defer();
		this.connected = this._connection.promise;
	}
  
  /**
	 * Sends a request to the provided uri to probe if it is currently up. Returns a Promise that is resolved if a 200 response is received and rejected with an error string otherwise
	 * @returns {Promise}
	 */
	static ping = (dest) =>
		Q.Promise((resolve, reject) => {
			let uri = url.parse(dest);
			let ping = net.connect({
				port: uri.port,
				host: uri.hostname,
				protocol: 'tcp'
			}, () => resolve() && ping.end())
        .on('error', reject);
		});

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
		dbg(`Connecting to DB: ${this.uri}`);
		return DB.ping(this.uri)
			.then(
				() => {
					dbg(`DB connection established!`);
					this._connection.resolve(this.adapter.connect(this.uri));
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
        
        // Geometric backoff
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
		this.connected.then(db =>	this.adapter.disconnect(db));

	/**
	 * Provide a Schema object and a label to identify the model
	 *
	 * @param schema
	 * @param label
	 * @returns {*}
	 */
	registerSchema = (schema, label) =>
		this.adapter.registerSchema(this, schema, label).then(model => {
			this.models[label] = {model, schema, label};
      dbg(`Registered ${label} Schema`)
			return model
		});

	/**
	 * Runs the DB Bootstrap code if necessary
	 */
	bootstrap = () =>
		this.connected.then(db => this.adapter.bootstrap(db));

	/**
	 * Execute a query against this DB
	 *
	 * @param queryStr
	 * @param params
	 */
	query = (queryStr, params = {}) =>
		this.connected.then(db =>
      dbgQuery(queryStr) ||
			this.adapter.query(db, queryStr, params)
		).catch(err => {
			if (wrap(err) instanceof DBConnectionError)
				this.refreshConnection() || this.connect();
			return Q.reject(err);
		});
}
