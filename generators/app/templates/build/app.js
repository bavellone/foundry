/*eslint-env node */
var gulp = require('gulp'),
		plugins = require('gulp-load-plugins')({
			pattern: ['gulp-*', 'gulp.*', 'node-*']
		}),
		notifier = require('node-notifier'),
		browserify = require('browserify'),
		watchify = require('watchify'),
		babelify = require('babelify'),
		source = require('vinyl-source-stream'),
		buffer = require('vinyl-buffer'),
		pack = require('../package'),
		utils = require('./utils'),
		_ = require('lodash');

function makeBundle() {
	return browserify({
		entries: [pack.paths.dist.app.js.entryPoint],
		extensions: ['.jsx'],
		transform: [babelify],
		debug: process.env.NODE_ENV != 'production',
		cache: {}, packageCache: {}, fullPaths: true
	})
			.external(pack.paths.src.vendor.deps)
			.external(_.map(pack.paths.src.vendor.libs, (id, name) => {
				return name
			}))
			.on('error', utils.onErr);
}

function appJS() {
	return bundleApp(makeBundle());
}

function watchAppJS() {
	var watcher = watchify(makeBundle());

	watcher.on('update', function () {
		bundleApp(watcher);
	})
			.on('error', utils.onErr);

	return bundleApp(watcher);
}

function bundleApp(b) {
	var bundle = b.bundle()
			.on('error', utils.onErr)
			.pipe(source(pack.paths.dist.app.js.file));

	if (process.env.NODE_ENV == 'production')
		bundle = bundle
				.pipe(buffer())
				.pipe(plugins.uglify());

	return bundle
			.pipe(gulp.dest(pack.paths.dist.app.js.dir))
			.on('end', utils.onEnd('AppJS Bundled!', 'green'));
}

function appSCSS() {
	return gulp.src(pack.paths.src.app.scss)
			.pipe(plugins.concat(pack.paths.dist.app.css.file))
			.pipe(plugins.sass())
			.on('error', function (err) {
				console.log(err.toString());
				this.emit('end');
			})
			.pipe(plugins.bytediff.start())
			.pipe(plugins.minifyCss())
			.pipe(plugins.bytediff.stop())
			.pipe(gulp.dest(pack.paths.dist.app.css.dir));
}

function appTest() {
	return gulp.src(pack.paths.src.app.test, {read: false})
			.pipe(plugins.mocha({
				reporter: 'mocha-unfunk-reporter',
				slow: 15
			}))
			.on('error', function (err) {
				notifier.notify({
					title: 'Mocha',
					message: err.message,
					sound: true
				});
				console.log('Error stack', err.stack);
			});
}

gulp.task('appJS', appJS);
gulp.task('watchAppJS', watchAppJS);
gulp.task('appSCSS', appSCSS);
gulp.task('app', ['appJS', 'appSCSS']);
gulp.task('test', appTest);
