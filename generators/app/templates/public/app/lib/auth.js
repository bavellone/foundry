/*eslint-env browser*/
'use strict';

import jwtDecode from 'jwt-decode';

import {API_Endpoint} from './api';

let _isAuth = false,
	_tok = (process.browser ? localStorage.getItem('token') : null),
	localStorageSupported = false;

try {
	localStorage.setItem('test', 'test');
	localStorage.removeItem('test');
	localStorageSupported = true;
} catch (e) {
	localStorageSupported = false;
}

if (_tok && _tok != '') {
	_isAuth = true;
	API_Endpoint.token = _tok;
}

export function setToken(token) {
	let decoded = decode(token);
	_isAuth = true;
	API_Endpoint.token = decoded;
	if (localStorageSupported)
		localStorage.setItem('token', decoded);
}

export function forgetToken() {
	_isAuth = false;
	API_Endpoint.token = '';
	if (localStorageSupported)
		localStorage.setItem('token', '');
	deleteCookies();
}

function deleteCookies() {
	var cookies = document.cookie.split(";");
	
	for (var i = 0; i < cookies.length; i++) {
		var cookie = cookies[i];
		var eqPos = cookie.indexOf("=");
		var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
		document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
	}
}

export function isAuth() {
	return _isAuth;
}

export function decode(token) {
	return jwtDecode(token)
}

export function reqLogin(nextState, replace) {
	if (!isAuth())
		replace({
			pathname: '/login',
			state: {nextPathname: nextState.location.pathname}
		})
}
