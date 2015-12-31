/*eslint-env browser*/
'use strict';

import React from 'react';
import _ from 'lodash';
import $ from 'jquery';
import Backbone from '../backbone';

export default class Home extends React.Component {
	componentDidMount() {
		//$.getJSON('/api/user').then(function (data) {
		//	console.log(data);
		//});
		//$.ajax({
		//	url: '/api/user',
		//	type: 'POST',
		//	data: JSON.stringify({
		//		name: 'Ben'
		//	}),
		//	contentType: 'application/json'
		//}).then(function (data) {
		//	console.log('got response');
		//	console.log(data);
		//}, (err) => console.error(err));
		//
		//Backbone.api.user.read({id: 532})
		//	.then(data => console.log(data))
	}

	render() {
		return (
			<div className='ui container home'>
				<h1>Welcome to <%= appName %>!</h1>
				<p><%= appDesc %></p>

			</div>
		);
	}
};


