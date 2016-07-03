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

export default class Seraph {
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
	ping = () => 
		Q.Promise((resolve, reject) => {
			request(this.uri, (err, res, body) => {
				if (err || res.statusCode != 200)
					return reject(err ? err.toString() : res.statusCode);
				resolve()
			})
		});
	
	registerSchema = (db, schema, label) =>
		dbg(`Registering ${schema.type} schema`) ||
		Q.Promise(resolve => {
			resolve(
				this.createModel(seraphModel(db, label), schema)
			);
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

	createModel = (model, schema) => {
		return new SeraphModel(model, schema)
	}
}

class SeraphModel extends Model {
	list = () =>
		Q.ninvoke(this.model, 'findAll')
			.then(models => models.map(model => this.schema.toJSON(model, this.schema.blacklist)));

	create = (data) =>
		new this.schema(data).validate(this.schema.validationSettings.create)
			.then(
				() => Q.ninvoke(this.model, 'save', data),
				err => Q.reject(new ValidationError(err))
			)
			.then(model => this.schema.toJSON(model, this.schema.blacklist));

	read = (id, ops = {raw: false}) =>
		Q.ninvoke(this.model, 'read', id)
			.then(model => ops.raw ? model : this.schema.toJSON(model, this.schema.blacklist));

	update = (id, data) =>
		this.read(id, {raw: true})
			.then(result => {
				return this.create({...result, ...data});
			});

	destroy = (id) =>
		Q.ninvoke(this.model, 'delete', id);

	destroyAll = () =>
		Q.ninvoke(this.model, 'query', `MATCH (n:${this.schema.type}) DETACH DELETE n`);
}