/*eslint-env node*/
'use strict';

import Q from 'q';
import debug from 'debug';
import neo4jDriver from 'neo4j-driver';
import uuid from 'uuid'
import _ from 'lodash';

import Model from './model';
import {ValidationError, Neo4jNotFound} from './../libs/errors';
import {createTimeTree} from './bootstrapCQL';

const dbg = debug('app:db:neo4j:bolt');
const neo4j = neo4jDriver.v1;

export default class Bolt {
	session = null;

	connect = (uri) =>
		neo4j.driver(uri, neo4j.auth.basic('neo4j', 'neo4j'), {
			encrypted: false
		});

	disconnect = driver =>
		driver.close();

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

	query = (driver, queryStr, params = {}) => {
		const session = driver.session();
		return Q.when(session.run(queryStr, params))
			.finally(() => session.close());
	};


	createModel = (model, schema) => {
		return new BoltModel(model, schema)
	}
}

class BoltModel extends Model {
	static transformRecords = records => {
		if (!(records instanceof Array))
			return [];
    var tmp;
		let data = _.reduce(records, (rv, record) => {
      tmp = record._fields[0].properties;
      tmp.id = tmp.uuid;
      delete tmp.uuid
			rv.push(tmp);
			return rv
		}, []);
		if (records.length === 1)
			data = data[0];
    if (records.length === 0)
      data = null;
		return data
	};
	
	list = (ops = {limit: 100}) =>
		this.model.query(`MATCH (n:${this.model.label}) RETURN n LIMIT ${ops.limit}`)
			.then(res => BoltModel.transformRecords(res.records))
			.then(models => _.map((models instanceof Array ? models : [models]), model => this.schema.toJSON(model, this.schema.blacklist)));

	create = (data) =>
		new this.schema(data)
			.validate(this.schema.validationSettings ? this.schema.validationSettings.create : {})
      .then(data => dbg('Validation passed') || data)
      .catch(err => Q.reject(new ValidationError(err)))
			.then(data => ({...data, uuid: uuid.v4()}))
			.then(
				data => this.model.query(`CREATE (n:${this.model.label} {params}) RETURN n`, {params: data})
			)
			.then(res => BoltModel.transformRecords(res.records))
			.then(model => this.schema.toJSON(model, this.schema.blacklist));

	read = (uuid, ops = {raw: false}) =>
		this.model.query(`MATCH (n:${this.model.label} {uuid: {uuid}}) RETURN n limit 1`, {uuid})
			.then(res => BoltModel.transformRecords(res.records))
      .then(record => {
        if (!record)
          return Q.reject(new Neo4jNotFound({message: `${this.schema.type} not found with ID: [${uuid}]`}))
        return record
      })
			.then(model => ops.raw ? model : this.schema.toJSON(model, this.schema.blacklist));

	update = (uuid, data) =>
    new this.schema(data)
      .validate()
      .then(
        data => this.model.query(`MATCH (n:${this.model.label} {uuid: {uuid}}) SET n += {data} RETURN n`, {data, uuid})
      )
      .then(record => {
        if (!record)
          return Q.reject(new Neo4jNotFound({message: `${this.schema.type} not found with ID: [${uuid}]`}))
        return record
      })
      .then(res => BoltModel.transformRecords(res.records))
      .then(model => this.schema.toJSON(model, this.schema.blacklist))

	destroy = uuid =>
		this.model.query(`MATCH (n:${this.schema.type} {uuid: {uuid}}) DETACH DELETE n`, {uuid});

	destroyAll = () =>
		this.model.query(`MATCH (n:${this.schema.type}) DETACH DELETE n`);
}
