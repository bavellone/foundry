/*eslint-env node */
var gulp = require('gulp'),
	_ = require('lodash'),
	fs = require('fs'),
	os = require('os'),
	path = require('path'),
	chalk = require('chalk'),
	argv = require('yargs').argv,
	pack = require('../package'),
	run = require('run-sequence'),
	q = require('q'),
	semver = require('semver'),
	utils = require('./utils'),
	mkdirp = require('mkdirp'),
	rimraf = require('rimraf');

require('./app');
require('./vendor');

gulp.task('clean', clean);
gulp.task('bump', bump);

gulp.task('build', function (cb) {
	run('clean', ['app', 'vendor'], cb);
});

function clean(cb) {
	q.nfcall(rimraf, 'public/assets/*')
		.then(() => cb())
}

function bump() {
	var bumpType = 'patch';

	if (!semver.valid(pack.version)) {
		console.log(chalk.red('Bump error: Package version is invalid!'));
		return;
	}

	if (argv.minor)
		bumpType = 'minor';
	else if (argv.major)
		bumpType = 'major';

	pack.version = semver.inc(pack.version, bumpType);

	fs.writeFileSync('./package.json', JSON.stringify(pack, null, 2));

	console.log(chalk.green('Bumped to', pack.version));
}
