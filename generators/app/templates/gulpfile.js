/*eslint-env node */
var gulp = require('gulp'),
	nodemon = require('gulp-nodemon'),
	run = require('run-sequence'),
	pack = require('./package');

require('./build/main');

gulp.task('watch:test', function () {
	gulp.watch(['server/**/*.js'], ['test']);
});

gulp.task('watch:app', function () {
	run('watchAppJS');
	gulp.watch([pack.paths.src.app.scss], ['appSCSS'])
});

gulp.task('watch:files', ['watch:app', 'watch:test']);

gulp.task('watch:server', function () {
	nodemon({
		script: pack.main,
		watch: ['server', 'server.js'],
		env: {
			'NODE_ENV': 'development'
		}
	})
});

gulp.task('watch', ['watch:server', 'watch:files']);

gulp.task('default', ['watch']);
