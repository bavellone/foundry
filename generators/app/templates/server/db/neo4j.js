/*eslint-env node*/
'use strict';


export function Neo4j(schema) {
	this.schema = schema;

	this.list = () =>
		q.ninvoke(schema.model, 'findAll')
			.then(models => _.map(models, model => schema.toJSON(model, schema.blacklist)));

	this.create = (data) =>
		new schema(data).validate(schema.validationSettings.create)
			.then(
				() => q.ninvoke(schema.model, 'save', data),
				err => q.reject(new ValidationError(err))
			)
			.then(model => schema.toJSON(model, schema.blacklist));

	this.read = (id, ops = {raw: false}) =>
		q.ninvoke(schema.model, 'read', id)
			.then(model => ops.raw ? model : schema.toJSON(model, schema.blacklist));

	this.update = (id, data) =>
		this.read(id, {raw: true})
			.then(result => {
				return this.create(_.assign(result, data));
			});

	this.destroy = (id) =>
		q.ninvoke(schema.model, 'delete', id);

	this.destroyAll = () =>
		q.Promise((resolve, reject) => {
			DB.connected.then(db =>
				db.queryRaw('MATCH (n) DETACH DELETE n', {}, err => {
					if (err)
						return reject(err);
					resolve();
				}))
		});

	return this;
}
