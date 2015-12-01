/*eslint-env browser*/
'use strict';

import React from 'react';
import {Link} from 'react-router';
import {RxReact} from '../lib/stream';

class Navbar extends React.Component {
	constructor(props) {
		super(props);
	}

	static defaultProps = {
		showNav: false,
		hideNav: () => {}
	};

	render() {
		const classes = 'ui vertical menu ' + (this.props.showNav ? 'active' : '');
		return (
				<nav className={classes}>
					<div className="item">
						<div className="header">
							<%= appName %>
						</div>
						<div className="menu">
							<Link className="item" to='home' onClick={this.props.hideNav}>Home</Link>
						</div>
					</div>
					<div className="item">
						<div className="header">Settings</div>
						<div className="menu">
							<div className="item">Settings</div>
						</div>
					</div>
				</nav>
		);
	}
}

export default RxReact(Navbar)
