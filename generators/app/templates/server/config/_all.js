module.exports = {
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
		apiKey: '<%= mailAPIKey %>',
		debug: {
			email: [{
				email: '<%= debugEmail %>',
				name: 'Debug'
			}]
		}
	}
};
