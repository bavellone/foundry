/*eslint-env node browser*/
'use strict';

import Schema from './schema';
import joi from '../utils/validate';

export default class ImageSchema extends Schema {
	static type = 'Image';
  static constraints = joi.object().keys({
    name: joi.string().required(),
    extension: joi.string(),
    type: joi.string(),
    size: joi.number().positive(),
    path: joi.string()
  });
}
