var gulp = require('gulp'),
	plugins = require('gulp-load-plugins')({
		pattern: ['gulp-*', 'gulp.*', 'node-*']
	}),
	_ = require('lodash'),
	path = require('path'),
	es = require('event-stream'),
	config = require('./server/config/config'),
	fs = require('fs'),
	chalk = require('chalk'),
	spawn = require('child_process').spawn,
	argv = require('yargs').argv,
	pack = require('./package'),
	run = require('run-sequence'),
	q = require('q');


var ENV = 1,
	ENV_PROD = 1,
	ENV_DEV = 2;

if (argv.dev == true || process.env.NODE_ENV == 'dev') {
	ENV = ENV_DEV;
}

var scripts = {
	deploy: './scripts/deploy.sh'
};

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

var notify = function(msg) {
	plugins.nodeNotifier.notify({
		title: config.app.title || 'Notification',
		message: msg
	});
};

var onEnd = function(msg) {
	return function() {
		console.log(msg);
		notify(msg);
	}
};


gulp.task('vendorJS', function() {
	return gulp.src(vendor.js)
		.pipe(plugins.concat('vendor.bundle.js'))
		.pipe(plugins.bytediff.start())
		.pipe(plugins.uglify())
		.pipe(plugins.bytediff.stop())
		.pipe(gulp.dest('public/assets/js'))
		.on('end', onEnd('Vendor JS compiled!'))
});

gulp.task('vendorCSS', function() {
	return gulp.src(vendor.css)
		.pipe(plugins.concat('vendor.bundle.css'))
		.pipe(plugins.bytediff.start())
		.pipe(plugins.minifyCss())
		.pipe(plugins.bytediff.stop())
		.pipe(gulp.dest('public/assets/css'))
		.on('end', onEnd('Vendor CSS compiled!'))
});

function appJS() {
	var js = gulp.src(app.js)
		.pipe(plugins.angularFilesort())
		.pipe(plugins.ngAnnotate()).on('error', function(err) {
			console.log('Annotation error', err.message);
		});

	if (ENV == ENV_PROD)
		js = js
			.pipe(plugins.concat('app.bundle.js'))
			.pipe(plugins.bytediff.start())
			.pipe(plugins.uglify())
			.pipe(plugins.bytediff.stop());

	return js
		.pipe(gulp.dest('public/assets/js'));
}

function appSCSS() {
	return gulp.src(app.scss)
		.pipe(plugins.concat('app.bundle.css'))
		.pipe(plugins.sass())
		.on('error', function(err) {
			console.log(err.toString());
			this.emit('end');
		})
		.pipe(plugins.bytediff.start())
		.pipe(plugins.minifyCss())
		.pipe(plugins.bytediff.stop())
		.pipe(gulp.dest('public/assets/css'));
}

function appHTML() {
	var template = _.template("<script id='<%%= name %>' type='text/ng-template'>\n<%%= content %>\n</script>");

	return gulp.src(app.html)
		.pipe(plugins.tap(function(file) {
			var arr = file.path.split(path.sep),
				name = arr.slice(arr.indexOf('app') + 1).join('.');
			file.contents = new Buffer(template({name: name, content: file.contents}));
		}));
}

gulp.task('app', function() {
	var scriptTmpl = _.template("<script defer src='<%%= path %>?ver=<%%= cacheVer %>'></script>");
	return gulp.src('public/index.html')
		.pipe(plugins.inject(es.merge(appHTML(), appJS(), appSCSS()), {
			ignorePath: 'assets',
			relative: true,
			transform: function(filePath, file) {
				var ext = filePath.split('.').pop();
				if (ext == 'html')
					return file.contents.toString('utf-8');
				else if (ext == 'js')
					return scriptTmpl({path: filePath, cacheVer: pack.version});

				return plugins.inject.transform.apply(plugins.inject.transform, arguments);
			}
		}))
		.pipe(gulp.dest('public/assets/'))
		.on('end', onEnd('Injected App HTML, JS & CSS!'))
});

gulp.task('vendor', ['vendorJS', 'vendorCSS']);

gulp.task('fonts', function() {
	return gulp.src(vendor.fonts)
		.pipe(gulp.dest('public/assets/fonts'));
});

gulp.task('clean', function() {
	return gulp.src('public/assets/')
		.pipe(plugins.clean());
});

gulp.task('build', function(cb) {
	run('clean', ['fonts', 'app', 'vendor'], cb);
});

gulp.task('test', function() {
	return gulp.src(app.test, {read: false})
		.pipe(plugins.mocha({
			reporter: 'mocha-unfunk-reporter',
			slow: 15
		}))
		.on('error', function(err) {
			plugins.nodeNotifier.notify({
				title: 'Mocha',
				message: err.message,
				sound: true
			});
			console.log('Error stack', err.stack);
		});
});

gulp.task('bump', function() {
	var semver = require('semver');
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

	fs.writeFileSync('./package.json', JSON.stringify(pack, null, 2));

	console.log(chalk.green('Bumped to', pack.version));
});

gulp.task('deploy', function(cb) {

	var tasks = [
		{
			cmd: 'git',
			args: ['pull']
		}, {
			cmd: 'npm',
			args: ['i']
		}, {
			cmd: 'bower',
			args: ['i']
		}
	];

	function spawnCmd(task) {
		return q.promise(function(resolve, reject) {
			spawn(task.cmd, task.args, {
				stdio: 'inherit'
			})
				.on('error', function(err) {
					console.log(err);
					reject(err);
				})
				.on('exit', resolve);
		})
	}

	spawnCmd(tasks[0]).then(function() {
		return spawnCmd(tasks[1])
	})
		.then(function() {
			console.log(chalk.green('Deployment successful!'));
			cb();
		}, function() {
			console.log(chalk.red('Deployment unsuccessful!'));
			cb();
		});
});


gulp.task('watch:test', function() {
	gulp.watch(['server/**/*.js'], ['test']);
});

gulp.task('watch:app', function() {
	gulp.watch([app.js, app.html.concat('public/index.html'), app.scss], ['app']);
});

gulp.task('watch:files', ['watch:app', 'watch:test']);

gulp.task('watch:server', function() {
	plugins.nodemon({
		script: 'server.js',
		watch: ['server', 'server.js'],
		env: {
			'NODE_ENV': 'dev'
		}
	})
		.on('stderr', function(err) { // not working
			console.log('Got error');
			console.log(err);
		});
	notify('Watching for changes...');
});

gulp.task('watch', ['watch:server', 'watch:files']);

gulp.task('default', ['watch']);
