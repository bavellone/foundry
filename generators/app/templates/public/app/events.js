/*eslint-env node*/
'use strict';

import Rx from 'rx';
import {RxStream} from './lib/stream';

const events = {};

events.page = {
	resize: Rx.Observable.fromEvent(window, 'resize')
};

events.nav = {
	transition: new RxStream(),
	menu: new RxStream()
};

events.auth = new RxStream();

events.nav.transition
		.listen('navTo')
		.subscribe((state) => {
			console.log('Navigating to ', state);
		});

events.nav.menu
		.listen('toggle')
		.subscribe(() => {
			console.log('Toggling nav menu');
		});

events.page.resize
	.subscribe(() => {
		console.log('resize');
	});


export default events;


