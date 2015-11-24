/*eslint-env node */
var gulp = require('gulp'),
		plugins = require('gulp-load-plugins')({
			pattern: ['gulp-*', 'gulp.*', 'node-*']
		}),
		_ = require('lodash'),
		browserify = require('browserify'),
		source = require('vinyl-source-stream'),
		buffer = require('vinyl-buffer'),
		utils = require('./utils'),
		pack = require('../package');

gulp.task('vendorCSS', function () {
	return gulp.src(pack.paths.src.vendor.css)
			.pipe(plugins.concat(pack.paths.dist.vendor.css.file))
			.pipe(plugins.bytediff.start())
			.pipe(plugins.minifyCss())
			.pipe(plugins.bytediff.stop())
			.pipe(gulp.dest(pack.paths.dist.vendor.css.dir))
			.on('end', utils.onEnd('Vendor CSS compiled!'))
});

gulp.task('vendorJS', function () {
	var b = browserify({
		debug: process.env.NODE_ENV != 'production'
	})
			.on('error', utils.onErr);

	let deps = pack.paths.src.vendor.deps
			.concat(pack.paths.src.vendor.libs);

	_.map(deps, function (id) {
		b.require(id);
	});

	var stream = b.bundle()
			.pipe(source(pack.paths.dist.vendor.js.file));

	if (process.env.NODE_ENV == 'production' || process.env.MINIFY == 'true')
		stream = stream
				.pipe(buffer())
				.pipe(plugins.uglify());

	return stream.pipe(gulp.dest(pack.paths.dist.vendor.js.dir));
});

gulp.task('vendorFonts', function () {
	return gulp.src(pack.paths.src.vendor.fonts)
			.pipe(gulp.dest(pack.paths.dist.vendor.fonts));
});


gulp.task('vendor', ['vendorJS', 'vendorCSS', 'vendorFonts']);
