/*eslint-env node */
var notify = require('node-notifier').notify,
	_ = require('lodash'),
	config = require('../server/config'),
	spawn = require('child_process').spawn,
	q = require('q');

var Utils = module.exports = {};


Utils.notify = function (msg) {
	notify({
		title: config.app.title || 'Notification',
		message: msg
	});
};

Utils.onEnd = function (msg) {
	return function () {
		console.log(msg);
		notify(msg);
	}
};

Utils.onErr = function () {
	return function (err) {
		console.log('Got err', err.toString());
		if (this.emit)
			this.emit('end');
	}
};

Utils.spawnCmd = function(task) {
	return q.promise(function (resolve, reject) {
		spawn(task.cmd, task.args, _.merge({}, {
			stdio: 'inherit',
			cwd: process.cwd()
		}, task.ops || {}))
			.on('error', function (err) {
				console.log(err);
				reject(err);
			})
			.on('exit', resolve);
	})
};
