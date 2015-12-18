/*eslint-env browser*/

import React from 'react';
import {RouteHandler} from 'react-router'
import classnames from 'classnames';

import {RxReact} from '../lib/stream';
import Backbone from '../backbone';
import Navbar from './navbar';

class App extends React.Component {
	constructor(props) {
		super(props);
	}
	state = {
		showOverlay: false,
		showNav: false,
		delayHidden: false
	};
	_setOverlay = (show) => {
		this.setState({
			showOverlay: show,
			delayHidden: !show
		});
		setTimeout(() => this.setState({delayHidden: false}), 200);
	};
	_showNav = () => {
		this._setOverlay(true);
		this.setState({
			showNav: true
		});
	};
	_hideNav = () => {
		this._setOverlay(false);
		this.setState({
			showNav: false
		});
	};
	_modalClasses = () => {
		return {
			active: this.state.showOverlay,
			hidden: !this.state.showOverlay && !this.state.delayHidden
		}
	};
	componentDidMount() {
		this._addStream(
			Backbone.page.resize
				.debounce(100)
				.subscribe(() => this.forceUpdate())
		)
	}
	render() {
		return (
			<div id="site-wrapper">
				
				<header id="site-header">
					<div id="site-header-menu-bar" className="ui inverted blue site aligned segment">
						<div className="ui container">
							<h1 className="ui inverted header">
								<i className="fa fa-fw fa-bars" onClick={this._showNav}></i>
								<span onClick={this._showNav} className="link"><%= appName %></span>
							</h1>
						</div>
					</div>
					
					<Navbar {...this.props} showNav={this.state.showNav} hideNav={this._hideNav}/>
					
				</header>
				
				<div id="site-body">
					
					
					<RouteHandler {...this.props}/>
				</div>
				
				<div id="modal-overlay" className={classnames(this._modalClasses())} onClick={this._hideNav}></div>
			</div>
		);
	}
}

export default RxReact(App)
