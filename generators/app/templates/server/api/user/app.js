/*eslint-env node*/
import CRUD from '../../libs/crud';
import User from './model';

module.exports = function UserModule(app) {
	return app.db
		.registerSchema(User, 'User')
		.then(CRUD)
};
