import _ from 'lodash';
import RxDOM from 'rx-dom';

// Define the API object
let API = {
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
		this.url = uri;
		this.routes = routes;
		// Attach a handle for each route
		_.map(routes, (route, key) => {
			this[key] = () => {
				return API_Endpoint.get(`${API.path}/${this.url}/${route.uri}`)
			}
		})
	}
	static get(url) {
		return RxDOM.DOM.getJSON(url)
	}
}

/**
 * Endpoint definitions
 */

API.container = new API_Endpoint('container', {
	list: {
		uri: 'list'
	}
});

API.image = new API_Endpoint('image', {
	list: {
		uri: 'list'
	}
});


export default API;
