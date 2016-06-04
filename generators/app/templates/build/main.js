/*eslint-env node */
var gulp = require('gulp'),
	fse = require('fs-extra'),
	chalk = require('chalk'),
	argv = require('yargs').argv,
	pack = require('../package'),
	spawn = require('child_process').spawn,
	async = require('async'),
	q = require('q'),
	semver = require('semver'),
	config = require('../server/config');

var app = require('./app');
var vendor = require('./vendor');

gulp.task('deploy', deploy);
gulp.task('hashPassword', hashPassword);

gulp.task('clean', clean);
gulp.task('bump', bump);

gulp.task('build', function (cb) {
	async.series([
		clean,
		async.parallel.bind(async, [
			app.appJS,
			app.appSCSS,
			vendor.vendorCSS,
			vendor.vendorJS,
			vendor.vendorMisc
		])
	], cb);
});

function clean(cb) {
	q.all([
			q.nfcall(fse.remove, 'assets/css'),
			q.nfcall(fse.remove, 'assets/js'),
			q.nfcall(fse.remove, 'assets/fonts'),
			q.nfcall(fse.remove, 'assets/index.html')
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

	fse.writeJson('./package.json', pack, {spaces: 2});

	console.log(chalk.green('Bumped to', pack.version));
}

function deploy(cb) {
	let error = false;
	console.log(chalk.green('Deploying version', pack.version, 'on port', config.deployPort));
	spawn('./build/deploy.sh', [pack.namespace, pack.version, config.deployPort], {
		stdio: 'inherit'
	})
		.on('error', function (err) {
			error = true;
			console.error(err);
			cb(err);
		})
		.on('exit', function () {
			if (!err)
				console.log(chalk.green(`Deployment of version ${pack.version} successful!`));
			cb();
		})
}

function hashPassword(cb) {
	var bcrypt = require('bcryptjs');

	const pass = argv.pass;

	bcrypt.genSalt(config.auth.saltWorkFactor, (err, salt) => {
		if (err) return console.error(err);

		// hash the password using our new salt
		bcrypt.hash(pass, salt, (err, hash) => {
			if (err) return console.error(err);

			// override the cleartext password with the hashed one
			console.log(`Hash(${pass}) = ${hash}`);
			cb()
		})
	})
}
