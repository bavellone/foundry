/*eslint-env browser */
'use strict';

import React from 'react';
import Router from 'react-router';
import Routes from './routes';
import Backbone from './backbone';
import $ from 'jquery';
import semantic from 'semantic';
import initEvents from './events';

// Initialize global event handlers
initEvents();

// Initialize data storage
let data = {};


Router.run(Routes, Router.HistoryLocation, (Handler, state) => {
	React.render(<Handler {...data} routerState={state}/>, document.querySelector('body'));
	$('[data-title], [data-content]').popup();
	Backbone.nav.transition
		.emitMsg('navTo', state);
});
