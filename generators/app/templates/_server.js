var restify = require('restify');

var server = restify.createServer({
	name: '<%= appName %>',
	version: '1.0.0'
});

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

server.get('/.*/', restify.serveStatic({
	directory: './public',
	default: 'index.html'
}));


server.listen(80, function () {
	console.log('Started server');
});
