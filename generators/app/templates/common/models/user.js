/*eslint-env node browser*/
'use strict';

import Schema from './schema';


export default class UserSchema extends Schema {
	constructor(data) {
		super(data);
	}
	static type = 'User';
	constraints = {
		name: {
			presence: true,
			length: {
				minimum: 2,
				message: 'must be 2 characters'
			}
		}
	}
}
