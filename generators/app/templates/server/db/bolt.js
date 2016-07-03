/*eslint-env node*/
'use strict';

import Q from 'q';
import debug from 'debug';
import neo4jDriver from 'neo4j-driver';
import request from 'request';
import _ from 'lodash';

import Model from './model';
import {ValidationError, wrap} from './../libs/errors';
import {createTimeTree} from './bootstrapCQL';

const dbg = debug('app:db:neo4j:bolt');
const neo4j = neo4jDriver.v1;

export default class Bolt {
	uri = '';
	session = null;

	constructor(uri) {
		this.uri = uri;
	};

	connect = () =>
		neo4j.driver(this.uri, neo4j.auth.basic('neo4j', 'neo4j'));

	disconnect = driver =>
		driver.close();

	/**
	 * Sends a request to the provided uri to probe if it is currently up. Returns a Promise that is resolved if a 200
	 * response is received and rejected with an error string otherwise
	 * @param uri
	 * @returns {Promise}
	 */
	ping = () =>
		Q.resolve();

	registerSchema = (db, schema, label) =>
	dbg(`Registering ${schema.type} schema`) ||
	Q.Promise(resolve => {
		resolve(
			this.createModel({query: this.query.bind(this, db), label}, schema)
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

	query = (driver, queryStr, params = {}) =>
	dbg(queryStr) || Q.when(
		driver.session()
			.run(queryStr, params)
	)
		.then(res => dbg('Done') || res)
		.catch(err => dbg(`Query Error! ${err.toString()}`) || Q.reject(wrap(err)));

	createModel = (model, schema) => {
		return new BoltModel(model, schema)
	}
}

class BoltModel extends Model {
	static transformRecords = records => {
		if (!(records instanceof Array))
			return [];

		let data = _.reduce(records, (rv, record) => {
			rv.push(record._fields[0].properties);
			return rv
		}, []);
		if (records.length === 1)
			data = data[0];
		return data
	};
	
	list = (ops = {limit: 100}) =>
		this.model.query(`MATCH (n:${this.model.label}) RETURN n LIMIT ${ops.limit}`)
			.then(res => BoltModel.transformRecords(res.records))
			.then(models => _.map((models instanceof Array ? models : [models]), model => this.schema.toJSON(model, this.schema.blacklist)));

	create = (data) =>
		new this.schema(data).validate(this.schema.validationSettings.create)
			.then(
				() => this.model.query(`CREATE (n:${this.model.label} {params}) RETURN n`, {params: data}),
				err => Q.reject(new ValidationError(err))
			)
			.then(res => BoltModel.transformRecords(res.records))
			.then(model => this.schema.toJSON(model, this.schema.blacklist));

	read = (id, ops = {raw: false}) =>
		this.model.query(`MATCH (n:${this.model.label}) return n limit 1`)
			.then(res => BoltModel.transformRecords(res.records))
			.then(model => ops.raw ? model : this.schema.toJSON(model, this.schema.blacklist));

	update = (id, data) =>
		this.read(id, {raw: true})
			.then(result => {
				return this.create({...result, ...data});
			});

	destroy = (id) =>
		this.model.query(`MATCH (n:${this.schema.type}) DETACH DELETE n`);

	destroyAll = () =>
		this.model.query(`MATCH (n:${this.schema.type}) DETACH DELETE n`);
}
