/*eslint-env node browser*/
'use strict';

import Schema from './schema';
import joi from '../utils/validate';

export default class UserSchema extends Schema {
	static type = 'User';
  static constraints = joi.object().keys({
    email: joi.string().email().trim().required(),
    password: joi.string().min(6).required().hide(),
    roles: joi.array().items(joi.string().valid('admin'))
  });
}
