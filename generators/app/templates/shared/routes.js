/*eslint-env node*/
'use strict';

import React from 'react';
import {Route, IndexRoute} from 'react-router'

import {App, HomePage} from './components/pages';

const createRoutes = store => {
  // const requireAuth = (nextState, replace) => {
  //   const { auth } = store.getState();
  //   
  //   if (!auth.isAuthenticated) 
  //     replace({
  //       pathname: '/',
  //       state: { nextPathname: nextState.location.pathname }
  //     });
  // }
    
  return (
    <Route path='/' component={App}>
        <IndexRoute component={HomePage}/>
        {/*<Route component={Profile} onEnter={requireAuth}/>*/}
    </Route>
  );
}

export default createRoutes;
