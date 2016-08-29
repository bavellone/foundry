/*eslint-env node*/
'use strict';

import path from 'path';
import {globMap} from '../libs/utils';

export default globMap('./server/api/*/', function (paths) {
	return {
		name: paths.file, // Name of module
		app: paths.full + path.sep + 'app.js' // Path to app
	};
});

export * from '../../shared/schemas';
