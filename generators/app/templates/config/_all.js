'use strict';

module.exports = {
	app: {
		title: '<%= appName %>'
	},
	port: process.env.PORT || 80,
	secure: process.env.SECURE || false,
	api: {
		enabled: true,
		version: 'v1',
		path: '/api'
	}
};
