/*eslint-env node*/
'use strict';

import path from 'path';
import {globMap} from '../libs/utils';

export default globMap('./server/api/*/', function (paths) {
	var app = require(paths.full + path.sep + 'app.js');

	return {
		name: paths.file, // Name of module
		app // Express Router object
	};
});
