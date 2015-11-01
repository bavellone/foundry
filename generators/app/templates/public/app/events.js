/*eslint-env node*/
'use strict';

import Backbone from './backbone';

export default function init() {
	/**

	 Global events

	 **/
	
	Backbone.nav.transition
		.listen('navTo')
		.subscribe((state) => {
			console.log('Navigating to ', state);
		});

	Backbone.nav.menu
		.listen('toggle')
		.subscribe(() => {
			console.log('Toggling nav menu');
		});
}


