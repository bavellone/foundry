/*eslint-env browser*/
'use strict';

import React from 'react';
import _ from 'lodash';
import Container from './container';

const CSSTransition = require('react/lib/ReactCSSTransitionGroup');

export default class Home extends React.Component {
	render() {
		return (
			<div className='ui container home'>
				<h1>Welcome to <%= appName %></h1>

				<CSSTransition className='ui grid' transitionAppear={true} transitionName='fade'></CSSTransition>
			</div>
		);
	}
};


