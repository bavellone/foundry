/*eslint-env browser */
'use strict';

import {RxStream} from './lib/stream';
import _ from 'lodash';
import API from './lib/api';

let Backbone = {};
export default Backbone;

Backbone.nav = {
	transition: new RxStream(),
	menu: new RxStream()
};

Backbone.auth = new RxStream();

_.map(_.filter(_.keys(API), (key) => !_.includes('config', key)), function (stream) {
	Backbone[stream] = API[stream];
});
