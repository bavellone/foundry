/*eslint-env browser*/

import React from 'react';
import {RouteHandler} from 'react-router'
import Backbone from '../backbone';
import Navbar from './navbar';

export default class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showOverlay: false
		};
	}
	setOverlay(show) {
		this.setState({
			showOverlay: show
		});
	}
	toggleNav() {
		this.setOverlay(true);
		Backbone.nav.menu.emitMsg('toggle');
	}
	handleCloseOverlay() {
		this.setOverlay(false);
		Backbone.nav.menu.emitMsg('set', {open: false});
	}
	render() {
		return (
			<div id="site-wrapper">
				
				<header id="site-header">
					<div className="ui inverted blue site aligned segment">
						<div className="ui container">
							<h1 className="ui inverted header">
								<i className="fa fa-fw fa-bars" onClick={this.toggleNav.bind(this)}></i>
								<%= appName %>
							</h1>
						</div>
					</div>
					
					<Navbar {...this.props} setOverlay={this.setOverlay.bind(this)}/>
					
				</header>
				
				<div id="site-body">
					
					
					<RouteHandler {...this.props}/>
				</div>
				
				<div id="modal-overlay" className={this.state.showOverlay ? 'active' : ''} onClick={this.handleCloseOverlay.bind(this)}>
					
				</div>
			</div>
		);
	}
}
