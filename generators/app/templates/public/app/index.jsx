/*eslint-env browser */
'use strict';

import React from 'react';
import ReactRouter from 'react-router';
import {Route, DefaultRoute} from 'react-router';
import {RxStream} from './lib/stream';
import Home from './home/home'


class Navbar extends React.Component {
	render() {
		return (
			<div className="ui container nav-container">
				<div className="ui large secondary inverted menu stacked">
					<Link to='home' className="item">Home</Link>
				</div>
			</div>
		);
	}
}

class App extends React.Component {
	render() {
		return (
			<div>
				<div className="ui inverted blue site masthead center aligned segment">
					<div className="ui container">
						<h1 className="ui inverted header"><%= appName %></h1>
					</div>
					<Navbar/>
				</div>

				<RouteHandler/>
			</div>
		);
	}
}

const Routes = (
	<Route handler={App} path='/'>
		<DefaultRoute name='home'/>
	</Route>
);

const Backbone = {
	nav: {
		transition: new RxStream()
	},
	auth: new RxStream()
};

ReactRouter.run(Routes, ReactRouter.HistoryLocation, (Handler, state) => {
	React.render(<Handler/>, document.querySelector('body'));
	Backbone.nav.transition.emitMsg('navTo', state);
});
