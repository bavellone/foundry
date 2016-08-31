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
import devTools from './devTools';

export * from './auth.redux';
export * from './image.redux';

export function createEnhancers(history, api) {
  if (process.env.NODE_ENV !== 'production')
    return compose(
      applyMiddleware(
        thunk,
        logger,
        routerMiddleware(history),
        applyAPIMiddleware(api),
        crashReporter
      ),
      devTools.instrument()
    );
  
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
    createRootReducer(),
    initialState,
    createEnhancers(history, api)
  );

  // Enable hot module replacement for reducers
  if (process.env.NODE_ENV !== 'production' && module.onReload)
    module.onReload(() => {
      store.replaceReducer(createRootReducer());
      return true;
    });

  return store;
}

export function createRootReducer() {
  return combineReducers({
    auth: require('./auth.redux').default,
    image: require('./image.redux').default,
    routing: routerReducer
  })
}
