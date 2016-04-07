/*eslint-env browser*/

import React from 'react';
import _ from 'lodash';

class App extends React.Component {
	static defaultProps = {};

	constructor(props) {
		super(props);
	}

	state = {};

	_genLinks = () =>
		_.reduce(this.props.routerState.routes[0].childRoutes, (links, route) => {
			if (route.name != 'root')
				links.push({
					to: route.route, text: route.handler.linkText, icon: route.handler.linkIcon
				});
			return links;
		}, []);

	render() {
		return (
			<div id="app">{this.props.children}</div>
		);
	}
}

export default App;
