/*eslint-env node*/
'use strict';

import Q from 'q';
import debug from 'debug';
import seraph from 'seraph';
import seraphModel from 'seraph-model';
import uuid from 'uuid'

import Model from './model';
import {ValidationError} from './../libs/errors';
import {createTimeTree} from './bootstrapCQL';

const dbg = debug('app:db:neo4j:seraph');

export default class Seraph {

	connect = (uri) =>
		seraph(uri);

	registerSchema = (db, schema, label) =>
		dbg(`Registering ${schema.type} schema`) ||
		db.connected.then(seraph => 
			this.createModel(Object.assign(seraphModel(seraph, label), {query: db.query}), schema)
		);

	bootstrap = db =>
		dbg('Checking if DB Bootstrap needed') ||
		db.query('MATCH (n:TimeTreeRoot) RETURN count(n) AS count').then(res => {
			if (res[0].count == 0)
				return Q.reject();
		})
		.catch(() =>
			dbg('Bootstrapping DB') ||
			db.query(createTimeTree).then(
				() => dbg('Created time tree') || dbg('Bootstrapping complete!')
			)
		);

	query = (db, queryStr, params = {}) =>
		Q.ninvoke(db, 'query', queryStr, params);

	createModel = (model, schema) => {
		return new SeraphModel(model, schema)
	}
}

class SeraphModel extends Model {
	list = () =>
		Q.ninvoke(this.model, 'findAll')
			.then(models => models.map(model => this.schema.toJSON(model, this.schema.blacklist)));

	create = data =>
		new this.schema(data)
			.validateCreate().catch(err => Q.reject(new ValidationError(err)))
			.then(data => ({...data, uuid: uuid.v4()}))
			.then(data => Q.ninvoke(this.model, 'save', data))
			.then(model => this.schema.toJSON(model, this.schema.blacklist));

	read = (uuid, ops = {raw: false}) =>
		Q.ninvoke(this.model, 'read', uuid)
			.then(model => ops.raw ? model : this.schema.toJSON(model, this.schema.blacklist));

	update = (id, data) =>
		this.read(id, {raw: true})
			.then(result => {
				return this.create({...result, ...data});
			});

	destroy = uuid =>
		this.model.query(`MATCH (n:${this.schema.type} {uuid: {uuid}}) DETACH DELETE n`, {uuid});

	destroyAll = () =>
		this.model.query(`MATCH (n:${this.schema.type}) DETACH DELETE n`);
}
