/*eslint-env node */
var gulp = require('gulp'),
	plugins = require('gulp-load-plugins')({
		pattern: ['gulp-*', 'gulp.*', 'node-*']
	}),
	_ = require('lodash'),
	browserify = require('browserify'),
	babelify = require('babelify'),
	uglifyify = require('uglifyify'),
  envify = require('loose-envify'),
	source = require('vinyl-source-stream'),
	buffer = require('vinyl-buffer'),
	utils = require('./utils'),
	pack = require('../package'),
	path = require('path'),
	fse = require('fs-extra'),
	q = require('q');

  var disc = require('disc')
  var fs = require('fs')
  
module.exports = {
	vendorCSS: vendorCSS,
	vendorJS: vendorJS,
	analyzeVendorJS: analyzeVendorJS,
	vendorMisc: vendorMisc
};
gulp.task('vendor', ['vendorJS', 'vendorCSS', 'vendorMisc']);
gulp.task('vendorMisc', vendorMisc);
gulp.task('vendorCSS', vendorCSS);
gulp.task('vendorJS', vendorJS);
gulp.task('analyzeVendorJS', analyzeVendorJS);

const isProd = (process.env.NODE_ENV === 'production');

function createVendorBundle() {
  const deps = pack.paths.src.vendor.deps.concat(pack.paths.src.vendor.libs);
  let bundler = browserify({
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
  
  return bundler.require(deps).on('error', utils.onErr);
}

function vendorJS() {
	var b = createVendorBundle();

	var stream = b.bundle()
		.pipe(source(pack.paths.dist.vendor.js.file));

	if (process.env.NODE_ENV == 'production' || process.env.MINIFY == 'true')
		stream = stream
			.pipe(buffer())
			.pipe(plugins.uglify());

	return stream.pipe(gulp.dest(pack.paths.dist.vendor.js.dir))
		.on('end', utils.onEnd('VendorJS Bundled!', 'green'));
}

function analyzeVendorJS(cb) {
	createVendorBundle()
    .bundle()
		.on('error', utils.onErr)
    .pipe(disc())
    .on('error', utils.onErr)
    .pipe(fs.createWriteStream('assets/analysis.html'))
    .on('finish', () => {
      utils.spawnCmd({
        cmd: 'chromium',
        args: [path.resolve('assets/analysis.html')]
      }).then(() => cb())
    })
}

function vendorCSS(cb) {
	let replace = {
		'../fonts': /(themes\/default\/assets\/fonts)/g, // Replace path to semantic font-icons
		'flags.png': /(themes\/default\/assets\/images\/flags.png)/g // Replace path to semantic flags
	};

	return gulp.src(pack.paths.src.vendor.css)
		.pipe(plugins.tap(function (file) {
			// For each CSS file
			file.contents = new Buffer( // Replace file contents
				_.reduce(replace, function (file, regex, str) { // Perform successive iterations on file contents
					return file.replace(regex, str); // Replace any string in file contents matched by regex 
				}, file.contents.toString()) // Need to use string instead of buffer
			);
		}))
		.pipe(plugins.concat(pack.paths.dist.vendor.css.file))
		.pipe(plugins.bytediff.start())
		.pipe(plugins.minifyCss())
		.pipe(plugins.bytediff.stop())
		.pipe(gulp.dest(pack.paths.dist.vendor.css.dir))
		.on('end', () => {
			utils.onEnd('Vendor SCSS compiled!')();
			cb();
		})
}

function vendorMisc(cb) {
	q.all([
		q.nfcall(
			fse.copy,
			path.resolve(pack.paths.src.vendor.fonts),
			path.resolve(pack.paths.dist.vendor.fonts)
		),
		q.nfcall(
			fse.copy,
			path.resolve(pack.paths.src.vendor.flags),
			path.resolve(pack.paths.dist.vendor.css.dir + '/flags.png')
		)
	]).then(
		() => cb(),
		::console.error
	);
}
