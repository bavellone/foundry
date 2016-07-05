/*eslint-env node browser*/
'use strict';

import Schema from './schema';


export default class UserSchema extends Schema {
	constructor(data) {
		super(data)
	}

	static type = 'User';
	static constraints = {
		email: {
			presence: true,
			email: {
				message: 'looks invalid'
			}
		},
		password: {
			presence: true,
			length: {
				minimum: 3
			}
		},
		roles: {
			inclusion: ['admin']
		},
		img: {
			presence: true
		},
		name: {
			presence: true
		},
		nat: {
			presence: true
		}
	};
}
