/*eslint-env node */
var gulp = require('gulp'),
	_ = require('lodash'),
	fs = require('fs'),
	chalk = require('chalk'),
	argv = require('yargs').argv,
	pack = require('../package'),
	run = require('run-sequence'),
	q = require('q'),
	semver = require('semver'),
	utils = require('./utils');

require('./app');
require('./vendor');

gulp.task('clean', clean);
gulp.task('bump', bump); 

gulp.task('build', function (cb) {
	run('clean', ['app', 'vendor'], cb);
});


function clean(cb) {
	var tasks = [
		{
			cmd: 'mkdir',
			args: ['-p', pack.paths.dist.app.js.dir]
		}, {
			cmd: 'mkdir',
			args: ['-p', pack.paths.dist.app.css.dir]
		},{
			cmd: 'ln',
			args: ['-s', process.cwd() + '/public/semantic/dist/themes', pack.paths.dist.app.css.dir + '/themes']
		}
	];

	q.all(_.map([pack.paths.dist.app.js.dir, pack.paths.dist.app.css.dir], function (dir) {
		return utils.spawnCmd({
			cmd: 'rm',
			args: ['-rf', dir]
		})
	})).then(function () {
		return q.all(_.map(tasks, utils.spawnCmd))
			.then(function () {
				cb();
			});
	}, function (err) {
		cb(err);
	});
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
