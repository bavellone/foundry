import {createAction} from '../utils';
import { push } from 'react-router-redux';

/**
 * Constants
 */
 export const LOGIN_REQUEST = 'LOGIN_REQUEST';
 export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
 export const LOGIN_FAILURE = 'LOGIN_FAILURE';
 export const LOGOUT_REQUEST = 'LOGOUT_REQUEST';
 export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
 export const LOGOUT_FAILURE = 'LOGOUT_FAILURE';
 export const CLEAR_ERROR_MESSAGE = 'CLEAR_ERROR_MESSAGE';


/**
 * Reducer
 */
 export default function AuthReducer(state = {
     isFetching: false,
     isAuthenticated: false
 }, action) {
  return ({
    [LOGIN_REQUEST]: (state, credentials) => ({
      ...state,
      credentials,
      isFetching: true,
      isAuthenticated: false
    }),
    [LOGIN_SUCCESS]: (state, user) => ({
      ...state,
      user,
      isFetching: false,
      isAuthenticated: true,
      errorMessage: ''
    }),
    [LOGIN_FAILURE]: (state, error) => ({
      ...state,
      error,
      isFetching: false,
      isAuthenticated: false
    }),
    [LOGOUT_SUCCESS]: state => ({
      ...state,
      isFetching: false,
      isAuthenticated: false
    }),
    [CLEAR_ERROR_MESSAGE]: state => ({
      ...state,
      errorMessage: null
    })
  }[action.type] || (state => state))(state, action.payload)
}


/**
 * Actions
 */
export function authenticate(creds) {
 return dispatch => {
   dispatch(createAction(LOGIN_REQUEST, creds));
   
   return fetch.post('/auth/authenticate', cred.email, creds.password)
     .then(handleErrors)
     .then(response => response.json())
     .then(data => {
         const user = fromJS(data);
         
         dispatch(createAction(LOGIN_SUCCESS, user));
         
         dispatch(push('/'));
     })
     .catch(err => {
         dispatch(createAction(LOGIN_FAILURE, err.message));
         return Promise.reject(err);
     });
 };
}

export function registerUser(creds) {
 return ( dispatch ) => {
   dispatch(createAction(LOGIN_REQUEST, creds));
   
   return fetch.post('/auth/signup', JSON.stringify(creds))
     .then(handleErrors)
     .then(response => response.json())
     .then(data => {
         const user = fromJS(data);
         
         dispatch(createAction(LOGIN_SUCCESS, user));
         
         // You probably want to dispatch a toast and delay redirect
         dispatch(push('/profile'));
     })
     .catch(err => {
         dispatch(createAction(LOGIN_FAILURE, err.message));
         return Promise.reject(err);
     });
 };
}

// TODO: Make this server only
export function serverLogin(user) {
 return ( dispatch ) => {
   return dispatch(createAction(LOGIN_SUCCESS, user));
 };
}

export function logoutUser() {
 return ( dispatch ) => {
   dispatch(createAction(LOGOUT_REQUEST));
   
   return fetch.get('/auth/logout')
     .then(handleErrors)
     .then((response) => {
         dispatch(createAction(LOGOUT_SUCCESS));
         
         // You probably want to dispatch a toast and delay redirect                
         dispatch(push('/'));
     })
     .catch(err => {
         dispatch(createAction(LOGOUT_FAILURE, err.message));
         return Promise.reject(err);
     });
 };
}

export function clearErrorMessage(dispatch) {
  dispatch(createAction(CLEAR_ERROR_MESSAGE))
}

function handleErrors(response) {
 if (!response.ok) {
   throw Error(response.headers.get("X-Error-Message"));
 }
 return response;
};
