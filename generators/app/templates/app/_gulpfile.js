var gulp = require('gulp'),
	plugins = require('gulp-load-plugins')({
		pattern: ['gulp-*', 'gulp.*', 'node-*']
	}),
	_ = require('lodash'),
	path = require('path'),
	config = require('./server/config/config');

var app = {
	js: ['public/app/**/*.js'],
	html: ['public/app/**/*.html'],
	scss: ['public/app/**/*.scss'],
	test: ['test/globals.js', 'test/utils.js', 'server/test/**/*.js', 'server/**/test.js']
};

var vendor = {
	js: [
		'bower_components/angular/angular.js',
		'bower_components/angular-ui-router/release/angular-ui-router.js',
		'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
		'bower_components/lodash/lodash.js',
		'bower_components/modernizr/modernizr.js',
		'bower_components/moment/moment.js'
	],
	css: [
		'bower_components/bootstrap/dist/css/bootstrap.css',
		'bower_components/bootstrap/dist/css/bootstrap-theme.css',
		'bower_components/fontawesome/css/font-awesome.css'
	],
	fonts: [
		'bower_components/bootstrap/dist/fonts/*',
		'bower_components/fontawesome/fonts/*'
	]
};

var notify = function (msg) {
	console.log(msg);
	plugins.nodeNotifier.notify({
		title: config.app.title || 'Notification',
		message:msg
	});
};

var onEnd = function (msg) {
	console.log(msg);
	return function () {
		notify(msg);
	}
};


gulp.task('vendorJS', function () {
	return gulp.src(vendor.js)
		.pipe(plugins.concat('vendor.bundle.js'))
		.pipe(plugins.bytediff.start())
		.pipe(plugins.uglify())
		.pipe(plugins.bytediff.stop())
		.pipe(gulp.dest('public/assets/js'))
		.on('end', onEnd('Vendor JS compiled!'))
});

gulp.task('vendorCSS', function () {
	return gulp.src(vendor.css)
		.pipe(plugins.concat('vendor.bundle.css'))
		.pipe(plugins.bytediff.start())
		.pipe(plugins.minifyCss())
		.pipe(plugins.bytediff.stop())
		.pipe(gulp.dest('public/assets/css'))
		.on('end', onEnd('Vendor CSS compiled!'))
});

gulp.task('appJS', function () {
	return gulp.src(app.js)
		.pipe(plugins.ngAnnotate()).on('error', function (err) {
			console.log('Annotation error',err.message);
		})
		.pipe(plugins.angularFilesort())
		.pipe(plugins.concat('app.bundle.js'))
		.pipe(plugins.bytediff.start())
		.pipe(plugins.if(process.env.NODE_ENV == 'prod', plugins.uglify()))
		.pipe(plugins.bytediff.stop())
		.pipe(gulp.dest('public/assets/js'))
		.on('end', onEnd('App JS compiled!'))
});


gulp.task('appSCSS', function () {
	return gulp.src(app.scss)
		.pipe(plugins.concat('app.bundle.css'))
		.pipe(plugins.sass())
		.pipe(plugins.bytediff.start())
		.pipe(plugins.minifyCss())
		.pipe(plugins.bytediff.stop())
		.pipe(gulp.dest('public/assets/css'))
		.on('end', onEnd('App SCSS compiled!'));
});


gulp.task('appHTML', function () {
	var template = _.template("<script id='<%%= name %>' type='text/ng-template'>\n<%%= content %>\n</script>");

	// Collect html and create script templates
	var html = gulp.src(app.html)
		.pipe(plugins.tap(function (file) {
			var dirname = path.dirname(file.path).split(path.sep).pop();
			var filename = path.basename(file.path);
			file.contents = new Buffer(template({name: dirname+'.'+filename, content: file.contents}));
		}));

	// Inject html templates into index.html
	return gulp.src('public/index.html')
		.pipe(plugins.inject(html, {
			name: 'templates',
			transform: function (filePath, file) {
				return file.contents.toString('utf-8');
			}}))
		.pipe(gulp.dest('public/'))
		.on('end', onEnd('App HTML compiled!'))
});


gulp.task('app', ['appJS', 'appHTML', 'appSCSS']);
gulp.task('vendor', ['vendorJS', 'vendorCSS']);

gulp.task('fonts', function () {
	return gulp.src(vendor.fonts)
		.pipe(gulp.dest('public/assets/fonts'));
});

gulp.task('build', ['fonts', 'app', 'vendor']);

gulp.task('test', function () {
	return gulp.src(app.test, {read: false})
		.pipe(plugins.mocha({
			reporter: 'mocha-unfunk-reporter',
			slow: 15
		}))
		.on('error', function (err) {
			plugins.nodeNotifier.notify({
				title: 'Mocha',
				message: err.message,
				sound: true
			});
			console.log('Error stack', err.stack);
		});
});


gulp.task('watch:test', function () {
	gulp.watch(['server/**/*.js'], ['test']);
});

gulp.task('watch:app', function () {
	gulp.watch(app.js, ['appJS']);
	gulp.watch(app.html, ['appHTML']);
	gulp.watch(app.scss, ['appSCSS']);
});

gulp.task('watch', ['watch:app', 'watch:test'], function () {
	plugins.nodemon({
		script: 'server.js',
		watch: ['server', 'server.js'],
		env: {
			'NODE_ENV': 'dev'
		}
	})
		.on('stderr', function (err) {
			console.log('Got error');
			console.log(err);
		});
	notify('Watching for changes...');
});

gulp.task('default', ['watch']);
