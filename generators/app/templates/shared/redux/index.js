/*eslint-env browser,node*/
import {
  createStore,
  applyMiddleware,
  compose,
  combineReducers
} from 'redux';
import {
  routerMiddleware,
  routerReducer
} from 'react-router-redux';
import thunk from 'redux-thunk';

import {
  logger,
  crashReporter,
  applyAPIMiddleware
} from './middleware';

import auth from './auth.redux';
export * from './auth.redux';

import image from './image.redux';
export * from './image.redux';

const rootReducer = combineReducers({
  auth,
  image,
  routing: routerReducer
});

const createEnhancers = (history, api) => {
  return compose(
    applyMiddleware(
      thunk,
      logger,
      routerMiddleware(history),
      applyAPIMiddleware(api),
      crashReporter
    )
  );
}

export default function createReduxStore(initialState = {}, history, api) {
  const store = createStore(
    rootReducer,
    initialState,
    createEnhancers(history, api)
  );

  // Enable hot module replacement for reducers
  if (process.env.NODE_ENV !== 'production' && module.onReload) {
    console.log('hot');

    module.onReload(() => {
      store.replaceReducer(combineReducers({
        auth: require('./auth.redux.js'),
        image: require('./image.redux.js'),
        routing: routerReducer
      }));
      return true;
    });
  }


  return store;
}
