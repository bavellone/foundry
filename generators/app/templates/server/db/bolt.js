/*eslint-env node*/
'use strict';

import Q from 'q';
import debug from 'debug';
import neo4jDriver from 'neo4j-driver';
import uuid from 'node-uuid'
import _ from 'lodash';
import net from 'net';
import url from 'url';

import Model from './model';
import {ValidationError} from './../libs/errors';
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
		neo4j.driver(this.uri);

	disconnect = driver =>
		driver.close();

	/**
	 * Sends a request to the provided uri to probe if it is currently up. Returns a Promise that is resolved if a 200
	 * response is received and rejected with an error string otherwise
	 * @returns {Promise}
	 */
	ping = () =>
		Q.Promise((resolve, reject) => {
			let uri = url.parse(this.uri);
			let ping = net.connect({
				port: uri.port,
				host: uri.host
			}, () => ping.end());
			ping
				.on('end', resolve)
				.on('error', reject)
		});

	registerSchema = (db, schema, label) =>
	dbg(`Registering ${schema.type} schema`) ||
	Q.Promise(resolve => {
		resolve(
			this.createModel({query: db.query, label}, schema)
		);
	});

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

	query = (driver, queryStr, params = {}) =>
		Q.when(driver.session().run(queryStr, params));

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
		new this.schema(data)
			.validateCreate().catch(err => Q.reject(new ValidationError(err)))
			.then(data => ({...data, uuid: uuid.v4()}))
			.then(
				data => this.model.query(`CREATE (n:${this.model.label} {params}) RETURN n`, {params: data}),
				err => Q.reject(new ValidationError(err))
			)
			.then(res => BoltModel.transformRecords(res.records))
			.then(model => this.schema.toJSON(model, this.schema.blacklist));

	read = (uuid, ops = {raw: false}) =>
		this.model.query(`MATCH (n:${this.model.label} {uuid: {uuid}}) return n limit 1`, {uuid})
			.then(res => BoltModel.transformRecords(res.records))
			.then(model => ops.raw ? model : this.schema.toJSON(model, this.schema.blacklist));

	update = (uuid, data) =>
		this.read(uuid, {raw: true})
			.then(result => {
				return this.create({...result, ...data});
			});

	destroy = uuid =>
		this.model.query(`MATCH (n:${this.schema.type} {uuid: {uuid}}) DETACH DELETE n`, {uuid});

	destroyAll = () =>
		this.model.query(`MATCH (n:${this.schema.type}) DETACH DELETE n`);
}
