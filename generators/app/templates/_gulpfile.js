var gulp = require('gulp'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	minCSS = require('gulp-minify-css'),
	sass = require('gulp-sass'),
	annotate = require('gulp-ng-annotate'),
	filesort = require('gulp-angular-filesort'),
	inject = require('gulp-inject'),
	tap = require('gulp-tap'),
	template = require('gulp-template'),
	path = require('path'),
	_ = require('lodash'),
	notifier = require('node-notifier'),
	es = require('event-stream'),
	filesize = require('gulp-filesize'),
	mocha = require('gulp-mocha');

var app = {
	js: ['./public/app/*.js', './public/app/**/*.js'],
	html: ['./public/app/*.html', './public/app/**/*.html'],
	scss: ['./public/app/*.scss', './public/app/**/*.scss']
};

var vendor = {
	js: [
		'./bower_components/angular/angular.js',
		'./bower_components/angular-ui-router/release/angular-ui-router.js',
		'./bower_components/angular-resource/angular-resource.js',
		'./bower_components/angular-bootstrap/ui-bootstrap.js'
	],
	css: [
		'./bower_components/bootstrap/dist/css/bootstrap.css',
		'./bower_components/bootstrap/dist/css/bootstrap-theme.css'
	]
};

var notify = function (msg) {
	notifier.notify({
		title: '<%= appName %>',
		message:msg
	});
};

var onEnd = function (msg) {
	return function () {
		notify(msg);
	}
};


gulp.task('vendorJS', function () {
	return gulp.src(vendor.js)
		.pipe(concat('vendor.bundle.js'))
		.pipe(uglify())
		.pipe(gulp.dest('./public/assets/js'))
		.on('end', onEnd('Vendor JS compiled!'))
});

gulp.task('vendorCSS', function () {
	return gulp.src(vendor.css)
		.pipe(concat('vendor.bundle.css'))
		.pipe(minCSS())
		.pipe(gulp.dest('./public/assets/css'))
		.on('end', onEnd('Vendor CSS compiled!'))
});

gulp.task('appJS', function () {
	return gulp.src(app.js)
		.pipe(annotate())
		.pipe(filesort())
		.pipe(concat('app.bundle.js'))
		.pipe(uglify())
		.pipe(gulp.dest('./public/assets/js'))
		.on('end', onEnd('App JS compiled!'))
});


gulp.task('appSCSS', function () {
	return gulp.src(app.scss)
		.pipe(concat('app.bundle.css'))
		.pipe(filesize())
		.pipe(sass())
		.pipe(filesize())
		.pipe(gulp.dest('./public/assets/css'))
		.on('end', onEnd('App SCSS compiled!'));
});


gulp.task('appHTML', function () {
	var template = _.template("<script id='<%%= name %>' type='text/ng-template'>\n<%%= content %>\n</script>");

	// Collect html and create script templates
	var html = gulp.src(app.html)
		.pipe(tap(function (file) {
			var filename = path.basename(file.path);
			file.contents = new Buffer(template({name: filename, content: file.contents}));
		}));

	// Inject html templates into index.html
	return gulp.src('./public/index.html')
		.pipe(inject(html, {
			name: 'templates',
			transform: function (filePath, file) {
				return file.contents.toString('utf-8');
			}}))
		.pipe(gulp.dest('./public/'))
		.on('end', onEnd('App HTML compiled!'))
});




gulp.task('app', ['appJS', 'appHTML', 'appSCSS']);
gulp.task('vendor', ['vendorJS', 'vendorCSS']);

gulp.task('fonts', function () {
	return gulp.src('./bower_components/bootstrap/dist/fonts/*')
		.pipe(gulp.dest('./public/assets/fonts'));
});

gulp.task('postInstall', ['fonts', 'app', 'vendor']);

gulp.task('test', function () {
	return gulp.src('./test/**/*.js', {read: false})
		.pipe(mocha({
			reporter: 'mocha-unfunk-reporter'
		}))
		.on('error', function (err) {
			this.emit('end');

			notifier.notify({
				title: 'Mocha',
				message: err.message,
				sound: true
			});
		});
});


gulp.task('watch-test', function () {
	gulp.watch('./test/**/*.js', ['test']);
});

gulp.task('watch-app', function () {
	gulp.watch(app.js, ['appJS']);
	gulp.watch(app.html, ['appHTML']);
	gulp.watch(app.scss, ['appSCSS']);
});

gulp.task('watch', ['watch-app', 'watch-test'], function () {
	notify('Watching for changes...');
});

gulp.task('default', ['watch']);
