import _ from 'lodash';
import $ from 'jquery';

// Define the API object
let API = {
	config: {
		version: '1',
		path: '/api'
	}
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
			this[key] = () => {
				return API_Endpoint[route.method || 'GET'](`${API.config.path}/${this.uri}/${route.uri || key}`)
			}
		})
	}
	static GET(...args) {
		return $.getJSON(...args)
	}
	static POST(...args) {
		return $.post(...args);
	}
	static PUT(...args) {
		return $.ajax({
			method: 'PUT',
			...args
		});
	}
	static DELETE(...args) {
		return $.ajax({
			method: 'DELETE',
			...args
		});
	}
}

/**
 * Endpoint definitions
 */

API.endpoint = new API_Endpoint('endpoint', {
	list: {}
});


export default API;
