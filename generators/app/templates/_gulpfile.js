var gulp = require('gulp'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	annotate = require('gulp-ng-annotate'),
	filesort = require('gulp-angular-filesort'),
	inject = require('gulp-inject'),
	tap = require('gulp-tap'),
	template = require('gulp-template'),
	path = require('path'),
	_ = require('lodash');


gulp.task('vendor', function () {
	return gulp.src([
		'./public/dist/angular/angular.js',
		'./public/dist/angular-ui-router/release/angular-ui-router.js',
		'./public/dist/angular-resource/angular-resource.js',
		'./public/dist/angular-bootstrap/ui-bootstrap.js'
	])
		.pipe(concat('vendor.bundle.js'))
		//.pipe(uglify())
		.pipe(gulp.dest('./public/dist'))
});

gulp.task('app', function () {
	return gulp.src('./public/app/**/*.js')
		.pipe(annotate())
		.pipe(filesort())
		.pipe(concat('app.bundle.js'))
		.pipe(uglify())
		.pipe(gulp.dest('./public/dist'));
});

gulp.task('htmlTemplates', function () {
	var template = _.template("<script id='<%= name %>' type='text/ng-template'>\n<%= content %>\n</script>");
	var html = gulp.src('./public/app/**/*.html')
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
		.pipe(gulp.dest('./public/'));
});

gulp.task('watchApp', function () {
	var js = gulp.watch('./public/app/**/*.js', ['app'])
		.on('change', function (e) {
			console.log('Recompiling JS...');
		});
	var html = gulp.watch('./public/app/**/*.html', ['htmlTemplates'])
		.on('change', function (e) {
			console.log('Inserting html...');
		});

	console.log('Watching app files....');
});

gulp.task('default', ['vendor', 'app']);