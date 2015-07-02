var _ = require('lodash');

module.exports = _.merge(
	require('./env/all'),
	require('./env/' + (process.env.NODE_ENV || 'dev'))
);
