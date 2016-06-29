/*eslint-env node*/
'use strict';

import q from 'q';

import User from '../api/user/model';
import {sign, verify} from './jwt';
import {AuthDenied} from './errors';


/**
 * Reads token from incoming requests and saves it to req.token
 */
export function readToken(req, res, next) {
	if (req.cookies.token)
		verify(req.cookies.token)
			.done(token => {
				req.token = token;
				next();
			}, () => {
				dbg('Token rejected');
				res.clearCookie('token');
				res.redirect(303, '/login');
			});
	else
		next();
}

/**
 * Throws an error if req.token is not set
 */
export function requireToken(req, res, next) {
	if (!req.token)
		next(new AuthDenied('Auth token is required'));
	else 
		next();
}

/**
 * Reads and verifies req.token
 */
export function isAuth(req, res, next) {
	if (req.token)
		res.status(200).end();
	else 
		res.status(401).end();
}

/**
 * Creates a new token
 */
export function createToken(data) {
	// Expires in 1d
	const expireDays = 1;
	const expires = Math.floor(Date.now() / 1000) + (3600 * 24 * expireDays);

	return sign({...data, expires});
}

/**
 * Login with the given email and password
 */
export function authenticate(email, password) {
	return User.login(email, password)
		.then(
			createToken,
			() => q.reject(new AuthDenied('Invalid Email/Password'))
		)
		.then(token => ({token}))
}

export function bootstrapAdminUser() {
	return User.registered.then(user => {
		return user.api.create(config.auth.admin)
	})
}
