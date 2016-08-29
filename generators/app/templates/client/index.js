/*eslint-env browser */
'use strict';

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { browserHistory, Router } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import $ from 'jquery';
import semantic from 'semantic';
// import ReactGA from 'react-ga';
// 
import createStore from '../shared/redux';
import createRoutes from '../shared/routes';
import API from './lib/api';

const store = createStore(window.__data, browserHistory, API);
const history = syncHistoryWithStore(browserHistory, store);

// ReactGA.initialize('UA-000000-01');
render(
    <Provider store={store}>
      <Router history={history} routes={createRoutes(store)} onUpdate={logPageView} />
    </Provider>,
    document.querySelector('#app-wrapper')
)
// $('[data-title], [data-content]').popup();

function logPageView() {
    // ReactGA.set({ page: window.location.pathname });
    // ReactGA.pageview(window.location.pathname);
};
