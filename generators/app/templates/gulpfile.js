/*eslint-env node */
require('babel/register')();

var gulp = require('gulp'),
	nodemon = require('gulp-nodemon'),
	run = require('run-sequence'),
	pack = require('./package');

require('./build/main');

gulp.task('watch:test', function () {
	gulp.watch(['server/**/*.js', 'server/**/*.jsx'], ['test']);
});

gulp.task('watch:app', function () {
    gulp.watch([pack.paths.src.app.scss], ['appSCSS']);
    gulp.run('watchAppJS');
});

gulp.task('watch:files', ['watch:app', 'watch:test']);

gulp.task('watch:server', function () {
    nodemon({
        script: pack.main,
        watch: ['server', 'server.js'],
        env: process.env
    })
});

gulp.task('watch', ['watch:server', 'watch:files']);

gulp.task('default', ['watch']);
