/*eslint-env node*/
var mongoose = require('mongoose'),
	debug = require('debug')('app:testing');


module.exports.establishDBConn = function establishDBConn(cb) {
	return function (done) {
		// Bootstrap db connection
		if (mongoose.connection.readyState == 0)
			mongoose.connect(config.db, function (err) {
				if (err) {
					console.error('Could not connect to MongoDB!');
					console.log(err);
					done(err);
				}
				else if (cb)
					cb(done);
				else
					done(null);
			});
		else if (cb)
			cb(done);
		else
			done(null);
	}
};

module.exports.closeDBConn = function (done) {
	if (mongoose.connection.readyState == 1) {
		debug('Closing connection');
		mongoose.connection.close(done);
	}
	else
		done();
};

module.exports.clearCollection = function clearCollection(model) {
	return function (done) {
		debug('Removing collection: ' + model.collection.name);
		model.collection.remove(done);
	}
};

module.exports.responseSuccess = function (res) {
	return JSON.parse(res.text).success;
};

module.exports.responses = {
	success: function (res) {
		expect(JSON.parse(res.text).success).to.be.ok;
	},
	hasContent: function (res) {
		expect(JSON.parse(res.text)).to.not.be.empty;
	}
};

module.exports.getUID = function (base) {
	function rand() {
		return Math.floor((1 + Math.random()) * 0x10000)
			.toString(16)
	}

	return base + '-' + rand();
};


global.utils = module.exports;
