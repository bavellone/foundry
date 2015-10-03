var config = require('../../config');

module.exports = function (Message) {

	return function DebugMessage(ops) {
		ops = ops || {};
		_.defaults(ops, {
			to: config.mail.debug.email,
			subject: 'Debug - <%= appName %>',
			from_email: '<%= appNS %>@bavellone.me',
			from_name: '<%= appName %>'
		});

		return new Message(ops);
	}
};
