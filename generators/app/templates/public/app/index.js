/*eslint-env browser */
'use strict';

import React from 'react';
import Router from 'react-router';
import Routes from './routes';
import Backbone from './backbone';
import $ from 'jquery';
import semantic from 'semantic';

// Initialize data storage
let data = {};


Router.run(Routes, Router.HistoryLocation, (Handler, state) => {
	React.render(<Handler data={data} routerState={state}/>, document.querySelector('#app'));
	$('[data-title], [data-content]').popup();
	Backbone.nav.transition
		.emitMsg('navTo', state);
});
