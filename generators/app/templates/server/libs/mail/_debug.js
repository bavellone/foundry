var config = require('../../config/config');

module.exports = function (Message) {

	return function DebugMessage(ops) {
		ops = ops || {};
		_.defaults(ops, {
			to: config.mail.debug.email,
			subject: 'Debug - LSR',
			from_email: 'debug@bavellone.me',
			from_name: 'Debug'
		});

		return new Message(ops);
	}
};
