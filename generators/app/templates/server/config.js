/*eslint-env node*/
import _ from 'lodash';

var all = {
		app: {
			title: '<%= appName %>',
			namespace: '<%= appNS %>'
		},
		interface: '127.0.0.1',
		port: process.env.PORT || 80,
		deployPort: 8080,
		assets: './assets',
		dataDir: './data',
		connectionPool: 1000,
		api: {
			path: '/api'
		},
		auth: {
			saltWorkFactor: 10,
			jwt: {
				secretKey: './config/token.key',
				publicKey: './config/token.pub'
			}
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
		dataDir: '/data',
		interface: '0.0.0.0',
		db: process.env.DB_URI || '<%= dbProto %>://db:<%= dbPort %>',
		port: process.env.PORT || 80
	},
	development = {
		dataDir: './data',
		db: process.env.DB_URI || '<%= dbProto %>://localhost:<%= dbPort %>',
		port: process.env.PORT || 8888
	},
	testing = {
		dataDir: './data',
		db: '<%= dbProto %>://localhost:1<%= dbPort %>',
		port: process.env.PORT || randomInt(10000, 50000)
	};

function randomInt(low, high) {
	return Math.floor(Math.random() * (high - low) + low);
}

module.exports = _.merge({}, all, (process.env.NODE_ENV ? eval(process.env.NODE_ENV) : development));
