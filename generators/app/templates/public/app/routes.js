/*eslint-env node*/
'use strict';

import React from 'react';
import {Route, DefaultRoute} from 'react-router'
import App from './components/app';
import Home from './components/home';

const Routes = (
	<Route handler={App} name='root' path='/'>
		<DefaultRoute handler={Home} name='home'/>
	</Route>
);

export default Routes;
