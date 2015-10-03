/*eslint-env node */
var gulp = require('gulp'),
	plugins = require('gulp-load-plugins')({
		pattern: ['gulp-*', 'gulp.*', 'node-*']
	}),
	notify = require('node-notifier').notify,
	browserify = require('browserify'),
	watchify = require('watchify'),
	babelify = require('babelify'),
	source = require('vinyl-source-stream'),
	buffer = require('vinyl-buffer'),
	pack = require('../package'),
	utils = require('./utils');

var bundle = browserify({
	entries: [pack.paths.dist.app.js.entryPoint],
	extensions: ['.jsx'],
	transform: [babelify],
	debug: process.env.NODE_ENV == 'production',
	cache: {}, packageCache: {}, fullPaths: true
})
	.external(pack.paths.src.vendor.deps)
	.on('error', utils.onErr);


function appJS() {
	return bundleApp(bundle);
}

function watchAppJS() {
	var watcher = watchify(bundle);
	
	watcher.on('update', function () {
		bundleApp(watcher);
	})
		.on('error', utils.onErr);

	return bundleApp(watcher);
}

function bundleApp(b) {
	var bundle = b.bundle()
		.pipe(source(pack.paths.dist.app.js.file));

	if (process.env.NODE_ENV == 'production')
		bundle = bundle
			.pipe(buffer())
			.pipe(plugins.uglify());

	return bundle
		.pipe(gulp.dest(pack.paths.dist.app.js.dir))
		.on('error', utils.onErr)
		.on('end', utils.onEnd('AppJS Bundled!'));
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
			notify({
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
