/*eslint-env node*/
import CRUD from '../../libs/crud';
import ImageSchema from './model';

module.exports = ImageModule;

function ImageModule(app) {
	return app.db
		.registerSchema(ImageSchema, 'Image')
		.then(modelAPI => CRUD(modelAPI))
}
