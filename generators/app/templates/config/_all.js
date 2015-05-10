module.exports = {
	app: {
		title: '<%= appName %>'
	},
	port: process.env.PORT || 80,
	secure: process.env.SECURE || false,
	connectionPool: 1000,
	api: {
		enabled: true,
		version: 'v1',
		path: '/api'
	},
	auth: {
		saltWorkFactor: 10,
		secret: '<%= authSecret %>'
	},
	sessionSecret: '<%= sessSecret %>',
	sessionCollection: 'sessions',
	enable: {
		registrations: false
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
