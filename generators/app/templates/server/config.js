/*eslint-env node*/
var _ = require('lodash');

var all = {
		app: {
			title: '<%= appName %>',
			namespace: '<%= appNS %>'
		},
		port: process.env.PORT || 80,
		connectionPool: 1000,
		api: {
			version: 'v1',
			path: '/api'
		},
		enable: {
			api: true
		},
		mail: {
			apiKey: process.env.MAIL_API_KEY,
			debug: {
				email: [{
					email: process.env.DEBUG_EMAIL,
					name: 'Debug'
				}]
			}
		}
	},
	production = {
		db: process.env.DB_URI || 'mongodb://db:27017/<%= appNS %>',
		port: process.env.PORT || 80
	},
	development = {
		db: process.env.DB_URI || 'mongodb://127.0.0.1:27017/<%= appNS %>-dev',
		port: process.env.PORT || 8888
	},
	testing = {
		db: 'mongodb://127.0.0.1:27017/<%= appNS %>-test',
		port: process.env.PORT || randomInt(10000, 50000)
	};

function randomInt(low, high) {
	return Math.floor(Math.random() * (high - low) + low);
}

module.exports = _.merge({}, all, (process.env.NODE_ENV ? eval(process.env.NODE_ENV) : development));
