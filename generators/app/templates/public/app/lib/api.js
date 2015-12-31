import _ from 'lodash';
import $ from 'jquery';

// Define the API object
let API = {},
	config = {
		version: '1',
		path: '/api'
	};

/**
 * The API_Endpoint acts as a wrapper around a remote endpoint. It returns
 * observable streams from all of it's methods.
 * @class API_Endpoint
 */
class API_Endpoint {
	constructor(uri, routes) {
		this.uri = uri;
		this.routes = routes;
		// Attach a handle for each route
		_.map(routes, (route, key) => {
			this[key] = (args) => {
				console.log(args);
				return API_Endpoint[route.method || 'GET']({url: `${config.path}/${this.uri}${args.id ? '/' + args.id : ''}`, ...args})
			}
		})
	}

	static GET(args) {
		console.log(args);
		return $.ajax({
			method: 'GET',
			...args
		})
	}

	static POST(args) {
		return $.ajax({
			method: 'GET',
			contentType: 'application/json',
			...args
		});
	}

	static PUT(args) {
		return $.ajax({
			method: 'PUT',
			contentType: 'application/json',
			...args
		});
	}

	static DELETE(args) {
		return $.ajax({
			method: 'DELETE',
			...args
		});
	}
}

/**
 * Endpoint definitions
 */

API.user = new API_Endpoint('user', {
	create: {
		method: 'POST'
	},
	read: {
		method: 'GET'
	}
});


export default function init(Backbone) {
	Backbone.api = {};

	// Initialize API routes
	_.map(_.keys(API), stream => {
		Backbone.api[stream] = API[stream];
	});
}
