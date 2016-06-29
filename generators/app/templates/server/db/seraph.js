/*eslint-env node*/
'use strict';

import Q from 'q';
import debug from 'debug';
import seraph from 'seraph';
import seraphModel from 'seraph-model';
import request from 'request';

import Model from './model';
import {ValidationError, wrap} from './../libs/errors';
import {createTimeTree} from './bootstrapCQL';

const dbg = debug('app:db:neo4j:seraph');

export class Seraph {
	uri = '';
	
	constructor(uri) {
		this.uri = uri;
	};
	
	connect = () => 
		seraph(this.uri);
	
	/**
	 * Sends a request to the provided uri to probe if it is currently up. Returns a Promise that is resolved if a 200
	 * response is received and rejected with an error string otherwise
	 * @param uri
	 * @returns {Promise}
	 */
	ping = (uri) => 
		Q.Promise((resolve, reject) => {
			request(uri, (err, res, body) => {
				if (err || res.statusCode != 200)
					return reject(err ? err.toString() : res.statusCode);
				resolve()
			})
		});
	
	registerSchema = (db, schema, label) => 
		Q.Promise(resolve => {
			// Create seraph model instance and attach to schema
			let model = seraphModel(db, label);
			model.DB = Seraph;
			model.type = schema.type;

			resolve(model);
		});

	bootstrap = () =>
		dbg('Checking if DB Bootstrap needed') ||
		this.query('MATCH (n:TimeTreeRoot) RETURN count(n) AS count').then(res => {
			if (res[0].count == 0)
				return Q.reject();
		})
		.catch(() =>
			dbg('Bootstrapping DB') ||
			this.query(createTimeTree).then(
				() => dbg('Created time tree') || dbg('Bootstrapping complete!')
			)
		);

	query = (db, queryStr, params = {}) =>
		Q.ninvoke(db, 'query', queryStr, params).catch(err => dbg(`Query Error! ${err.toString()}`) || wrap(err));

	static model = (schema, ops) => {
		return new SeraphModel(schema, ops)
	}
}

class SeraphModel extends Model {
	list = () =>
		Q.ninvoke(this.model, 'findAll')
			.then(models => models.map(model => this.toJSON(model, this.blacklist)));

	create = (data) =>
		new this.schema(data).validate(this.validationSettings.create)
			.then(
				() => Q.ninvoke(this.model, 'save', data),
				err => Q.reject(new ValidationError(err))
			)
			.then(model => this.toJSON(model, this.blacklist));

	read = (id, ops = {raw: false}) =>
		Q.ninvoke(this.model, 'read', id)
			.then(model => ops.raw ? model : this.toJSON(model, this.blacklist));

	update = (id, data) =>
		this.read(id, {raw: true})
			.then(result => {
				return this.create({...result, ...data});
			});

	destroy = (id) =>
		Q.ninvoke(this.model, 'delete', id);

	destroyAll = () =>
		Q.Promise((resolve, reject) => {
			DB.connected.then(db =>
				db.queryRaw('MATCH (n) DETACH DELETE n', {}, err => {
					if (err)
						return reject(err);
					resolve();
				}))
		});
}