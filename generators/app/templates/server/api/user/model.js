/*eslint-env node*/
'use strict';

import q from 'q';

import DB from '../../db';
import UserSchema from '../../../common/models/user';

export default DB.registerSchema(UserSchema, 'User');
