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
    uploadDir: './data/uploads',
		connectionPool: 1000,
		api: {
			path: '/api',
      enable: true
		},
		auth: {
			saltWorkFactor: 10,
			jwt: {
				secretKey: './config/token.key',
				publicKey: './config/token.pub'
			}
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
		db: process.env.DB_URI || 'bolt://db:7687',
		port: process.env.PORT || 80
	},
	development = {
		dataDir: './data',
		db: process.env.DB_URI || 'bolt://localhost:7687',
		port: process.env.PORT || 8888
	},
	testing = {
		dataDir: './data',
		db: 'bolt://localhost:7687',
		port: process.env.PORT || randomInt(10000, 50000)
	};

function randomInt(low, high) {
	return Math.floor(Math.random() * (high - low) + low);
}

module.exports = _.merge({}, all, (process.env.NODE_ENV ? eval(process.env.NODE_ENV) : development));
