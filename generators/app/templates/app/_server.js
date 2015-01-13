var express = require('express'),
	chalk = require('chalk'),
	config = require('./server/config/config');

var app = express();

require('./server/init.js')(app);

app.listen(80, function () {
	console.log('<%= appName %> Init complete');
});
