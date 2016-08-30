/*eslint-env browser,node*/
import debug from 'debug';
const dbg = debug('app:redux');

if (process.env.NODE_ENV == 'development')
  debug.enable("app:redux")

export const logger = store => next => action => {
	dbg(`dispatching ${action.type}`);
	let result = next(action);
	dbg('Next State:', store.getState());
	return result
};

export const crashReporter = () => next => action => {
	try {
		return next(action)
	} catch (err) {
		console.error('Caught an unhandled exception!', err);
		throw err
	}
};

export function applyAPIMiddleware(api) {
  return ({dispatch, getState}) => {
    return next => action => {
      if (typeof action === 'function') 
        return action(dispatch, getState);
      
      const {apiCall, types, ...rest} = action;
      if (!apiCall)
        return next(action);
      
      const [REQUEST, SUCCESS, FAILURE] = types;
      dispatch({...rest, type: REQUEST});
      
      console.time('api')
      return apiCall(api)
        .then(result => console.timeEnd('api') || result)
        .then(payload => dispatch({payload, type: SUCCESS}))
        .catch(error => {
          console.error('API ERROR:', error);
          dispatch({...rest, error, type: FAILURE});
        })
    }
  }
}
