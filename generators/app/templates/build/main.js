/*eslint-env node */
var gulp = require('gulp'),
	fs = require('fs'),
	chalk = require('chalk'),
	argv = require('yargs').argv,
	pack = require('../package'),
	run = require('run-sequence'),
	q = require('q'),
	semver = require('semver'),
	rimraf = require('rimraf');

require('./app');
require('./vendor');

gulp.task('clean', clean);
gulp.task('bump', bump);

gulp.task('build', function (cb) {
	return run('clean', ['app', 'vendor'], cb);
});

gulp.task('deploy', deploy);

function clean(cb) {
	q.all([
			q.nfcall(rimraf, 'assets/css'),
			q.nfcall(rimraf, 'assets/js'),
			q.nfcall(rimraf, 'assets/fonts'),
			q.nfcall(rimraf, 'assets/index.html')
		])
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

function deploy(cb) {
	console.log(chalk.green('Deploying version', pack.version));
	spawn('./build/deploy.sh', [pack.namespace, pack.version], {
		stdio: 'inherit'
	})
		.on('error', function (err) {
			console.log(err);
			cb(err);
		})
		.on('exit', function () {
			console.log(chalk.green('Deployment successful!'));
			cb();
		})
}
