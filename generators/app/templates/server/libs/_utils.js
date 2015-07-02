
var config = require('../config/config'),
	_ = require('lodash'),
	glob = require('glob'),
	path = require('path');


function globMap(globPath, callback) {
	return _.map(glob.sync(globPath), function (appPath) {
		var paths = {
			file: path.resolve(appPath).split(path.sep).pop().split('.')[0],
			full: path.resolve(appPath),
			dir: path.dirname(path.resolve(appPath)).split(path.sep).pop()
		};
		return callback(paths);
	});
}

function globReduce(globPath, callback) {
	return _.reduce(glob.sync(globPath), function (map, appPath) {
		var paths = {
			file: path.resolve(appPath).split(path.sep).pop().split('.')[0],
			full: path.resolve(appPath),
			dir: path.dirname(path.resolve(appPath)).split(path.sep).pop()
		};
		return callback(map, paths);
	}, {});
}


module.exports = {
	globMap: globMap,
	globReduce: globReduce
};
