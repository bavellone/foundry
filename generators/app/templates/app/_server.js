var express = require('express'),
	chalk = require('chalk'),
	config = require('./server/config/config');

var app = express();

require('./server/init.js')(app);

app.listen(config.port, function () {
	console.log('<%= appName %> Init complete');
});
