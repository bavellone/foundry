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
					<div className="menu">
						<Link className="item" to='home' onClick={this.props.hideNav}>Home<i className='home icon'></i></Link>
					</div>
				</div>
			</nav>
		);
	}
}

export default RxReact(Navbar)
