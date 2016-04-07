/*eslint-env node*/
'use strict';

import React from 'react';
import {Route, IndexRoute} from 'react-router'

import App from './views/app';
import Home from './views/home';

const Routes = (
	<Route component={App} path='/'>
		<IndexRoute component={Home}/>
	</Route>
);

export default Routes;
