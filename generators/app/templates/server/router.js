/*eslint-env node*/

import React from 'react';
import { renderToString, renderToStaticMarkup } from 'react-dom/server';
import { Provider } from 'react-redux';
import { match, RouterContext, createMemoryHistory } from 'react-router';

import {HTMLDocument} from '../shared/components';
import createRoutes from '../shared/routes';
import createStore from '../shared/redux';
import {fetchComponentsData} from '../shared/utils';
import {return404, catchAll, wrap} from './libs/errors';
import debug from 'debug';

const pack = require('../../package.json');

const dbgReq = debug('app:request');

export default function attachRouter(app) {
	app.get('*', renderRoute);

	// Send 404 for any requests that don't match API or static routes
	app.use((req, res, next) => dbgReq(`404 returned for ${req.method} ${req.path}`) || next())
	app.use(return404);

	// Error handling
	app.use(catchAll);
}

function renderRoute(req, res, next) {
  const history = createMemoryHistory(req.originalUrl);
  const store = createStore({}, history, req.app.db.modelAPI);
        
	match({routes: createRoutes(store), location: req.path}, (err, redirectLocation, renderProps) => {
    if (err || !renderProps) 
			return next(err);
    
    if (redirectLocation) 
			return (
        dbgReq(`${req.ip} Redirecting page ${req.path} to ${redirectLocation.pathname}`) || 
        res.redirect(302, redirectLocation.pathname + redirectLocation.search)
      );
    
    // Valid request, render the page
		if (req.path == '/')
			res.header('X-Version', pack.version);
    
    render(req, res, next, store, renderProps)
  })
}

function render(req, res, next, store, renderProps) {
  const {dispatch} = store;
  const {params, components, location: {query}} = renderProps;
  fetchComponentsData({
    dispatch, 
    components, 
    params, 
    query
  })
    .then(() => {
      const body = renderToString(
        <Provider store={store}>
          <RouterContext {...renderProps} />
        </Provider>
      );
      
      res.send('<!DOCTYPE html>' + renderToStaticMarkup(
        <HTMLDocument 
        body={body}
        isProd={process.env.NODE_ENV == 'production'} 
        store={store}
        />
      ))
    })
    .catch((err) => {
        next(wrap(err))
    });
}
