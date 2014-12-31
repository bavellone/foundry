var gulp = require('gulp'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	annotate = require('gulp-ng-annotate'),
	filesort = require('gulp-angular-filesort'),
	inject = require('gulp-inject'),
	tap = require('gulp-tap'),
	template = require('gulp-template'),
	path = require('path'),
	_ = require('lodash'),
	notifier = require('node-notifier'),
	es = require('event-stream');

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
		'./bower_components/bootstrap'
	]
};

var notify = function (msg) {
	notifier.notify({
		title: 'Gulp',
		message:msg,
		sound: true
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
		.pipe(gulp.dest('./public/assets/js')).on('end', onEnd('Vendor JS compiled!'))
});

gulp.task('appJS', function () {
	return gulp.src(app.js)
		.pipe(annotate())
		.pipe(filesort())
		.pipe(concat('app.bundle.js'))
		.pipe(uglify())
		.pipe(gulp.dest('./public/assets/js')).on('end', onEnd('App JS compiled!'))
});


gulp.task('appHTML', function () {
	var template = _.template("<script id='<%%= name %>' type='text/ng-template'>\n<%%= content %>\n</script>");
	var html = gulp.src(app.html)
		.pipe(tap(function (file) {
			var filename = path.basename(file.path);
			file.contents = new Buffer(template({name: filename, content: file.contents}));
		}));

	return gulp.src('./public/index.html')
		.pipe(inject(html, {
			name: 'templates',
			transform: function (filePath, file) {
				return file.contents.toString('utf-8');
			}
		}))
		.pipe(gulp.dest('./public/')).on('end', onEnd('App HTML compiled!'))
});

gulp.task('app', ['appJS', 'appHTML']);
gulp.task('vendor', ['vendorJS']);


gulp.task('watchApp', function () {
	gulp.watch(app.js, ['appJS']);
	gulp.watch(app.html, ['appHTML']);
	notify('Watching for changes...');
});

gulp.task('default', ['watchApp']);
