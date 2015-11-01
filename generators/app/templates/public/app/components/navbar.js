/*eslint-env browser*/
'use strict';

import React from 'react';
import {Link} from 'react-router';
import Backbone from './../backbone';

export default class Navbar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false
		};
	}
	componentDidMount() {
		this.streams = [
			Backbone.nav.menu
				.listen('toggle')
				.subscribe(() => {
					this.setNav(!this.state.open);
				}),
			Backbone.nav.menu
				.listen('set')
				.pluck('open')
				.subscribe((open) => {
					this.setNav(open);
				})
		];
	}
	setNav(open) {
		this.setState({
			open: open
		});
	}
	handleNavClick() {
		this.setNav(false);
		this.props.setOverlay(false);
	}
	componentWillUnmount() {
		this.streams.map((stream) => stream.dispose());
	}
	render() {
		const classes = 'ui vertical menu ' + (this.state.open ? 'active' : '');
		return (
			<nav className={classes}>
				<div className="item">
					<div className="header">Management</div>
					<div className="menu">
						<Link className="item" to='overview' onClick={this.handleNavClick.bind(this)}>Overview</Link>
						<Link className="item" to='library' onClick={this.handleNavClick.bind(this)}>Library</Link>
					</div>
				</div>
				<div className="item">
					<div className="header">Settings</div>
					<div className="menu">
						<div className="item">App Settings</div>
					</div>
				</div>
			</nav>
		);
	}
}

