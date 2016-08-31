/*eslint-env node */
var gulp = require('gulp'),
	plugins = require('gulp-load-plugins')({
		pattern: ['gulp-*', 'gulp.*', 'node-*']
	}),
	notifier = require('node-notifier'),
	browserify = require('browserify'),
	chalk = require('chalk'),
	path = require('path'),
	watchify = require('watchify'),
  envify = require('loose-envify'),
	babelify = require('babelify'),
	uglifyify = require('uglifyify'),
	livereactload = require('livereactload'),
	source = require('vinyl-source-stream'),
	buffer = require('vinyl-buffer'),
	pack = require('../package'),
	utils = require('./utils');

var disc = require('disc')
var fs = require('fs')

module.exports = {
	appJS: appJS,
	analyzeAppJS: analyzeAppJS,
	appSCSS: appSCSS
};

const isProd = (process.env.NODE_ENV === 'production');

function createBundler(useWatchify, cb) {
  const plugin = [];
  
  if (!isProd && useWatchify)
    plugin.push(livereactload)
  
  let bundler = browserify({
		entries: [pack.paths.dist.app.js.entryPoint],
		extensions: ['.jsx'],
    plugin,
		debug: !isProd,
		cache: {}, packageCache: {}, fullPaths: !isProd
	})
    .transform(babelify, {
      compact: true, 
      sourceMaps: (isProd ? false : 'inline'),
      minified: false,
      comments: !isProd
    })
    .transform(envify);
  
  if (isProd)
    bundler.transform(uglifyify, {global: true})
  
  return bundler
		.external(pack.paths.src.vendor.deps.concat(pack.paths.src.vendor.libs))
		.on('error', utils.onErr)
		.on('end', () => cb ? cb() : null);
}

function appJS(cb) {
	bundleApp(createBundler(false, cb))
}

function analyzeAppJS(cb) {
	createBundler(false)
    .bundle()
		.on('error', utils.onErr)
    .pipe(disc())
    .pipe(fs.createWriteStream('assets/analysis.html'))
    .on('finish', () => {
      utils.spawnCmd({
        cmd: 'chromium',
        args: [path.resolve('assets/analysis.html')]
      }).then(() => cb())
    })
}

function watchAppJS() {
	var watcher = watchify(createBundler(true));

	watcher
		.on('update', function () {
			bundleApp(watcher);
		})
		.on('error', utils.onErr);

	return bundleApp(watcher);
}

function bundleApp(b) {
	var bundle = b.bundle()
		.on('error', utils.onErr)
		.pipe(source(pack.paths.dist.app.js.file));
  
	if (isProd || process.env.MINIFY == 'true')
		bundle = bundle
			.pipe(buffer())
			.pipe(plugins.uglify()).on('error', utils.onErr);

	return bundle
		.pipe(gulp.dest(pack.paths.dist.app.js.dir))
		.on('end', utils.onEnd('AppJS Bundled!', 'green'));
}

function appSCSS(cb) {
	gulp.src(pack.paths.src.app.scss)
		.pipe(plugins.concat(pack.paths.dist.app.css.file))
		.pipe(plugins.sass({
			outputStyle: (isProd ? 'compressed' : 'expanded')
		}).on('error', plugins.sass.logError))
		.pipe(plugins.bytediff.start())
		.pipe(plugins.minifyCss())
		.pipe(plugins.bytediff.stop())
		.pipe(gulp.dest(pack.paths.dist.app.css.dir))
		.on('end', () => {
			utils.onEnd('App SCSS compiled!')();
			cb();
		});
}

function appTest() {
	return gulp.src(pack.paths.src.app.test, {read: false})
		.pipe(plugins.mocha({
			reporter: 'mocha-unfunk-reporter',
			slow: 20
		}))
		.on('error', function (err) {
			notifier.notify({
				title: 'Mocha',
				message: err.message,
				sound: true
			});
			console.error(chalk.red(err.message));
			process.exit(0);
		});
}

gulp.task('appJS', appJS);
gulp.task('analyzeAppJS', analyzeAppJS);
gulp.task('watchAppJS', watchAppJS);
gulp.task('appSCSS', appSCSS);
gulp.task('app', ['appJS', 'appSCSS']);
gulp.task('test', appTest);

gulp.task('watch:app', function () {
	gulp.watch([pack.paths.src.app.scss], ['appSCSS']);
	return watchAppJS();
});
