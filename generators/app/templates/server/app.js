/*eslint-env node*/
// TODO - need to add proper logging support, i.e. add a logging lib and routes all logs through handlers

var path = require('path'),
	config = require('./config'),
	express = require('express'),
	bodyParser = require('body-parser'),
	cookieParser = require('cookie-parser'),
	http = require('http'),
	pack = require('../package'),
	debug = require('debug'),
	dbgInit = debug('app:init'),
	dbgErr = debug('app:error'),
	dbgReq = debug('app:request'),
	errors = require('./libs/errors');

import fs from 'fs';
import Q from 'q';
z
<% if (useDB) { %>
import DB from './db';
import DBAdapter from './db/<%= DBAdapterPath %>';<% } if (useAuth) { %>
import {readToken} from './libs/auth';<% } %>

module.exports = function () {
	dbgInit('Creating new app');
	var app = express();
	
	app.locals.config = config;

	// Get rid of express header
	app.disable('x-powered-by');

	// Use IP address from HAProxy X-Forwarded-For header
	app.enable('trust proxy');
	<% if (useDB) { %>
	app.db = new DB({
		adapter: new DBAdapter(config.db)
	});<% } %>

	http.globalAgent.maxSockets = config.connectionPool;

	// Serve app shell when root is requested
	app.get('/', (req, res) => {
		res.header('X-Version', pack.version);
		fs.createReadStream(path.resolve(path.join(config.assets,'/index.html')))
			.pipe(res)
	});
	app.use('/assets', express.static(path.resolve(config.assets)));
	app.use('/assets', express.static(path.resolve(config.dataDir)));
	app.get('/assets/favicon.png', (req, res) => {
		res.sendStatus(404).end();
	});

	// Setup parsers
	app.use(bodyParser.json());

	app.use((err, req, res, next) => {
		res.status(400).send('Malformed Request');
	});

	app.use(cookieParser());
	app.use(bodyParser.urlencoded({
		extended: true
	}));
	<% if (useAuth) { %>
	app.use(readToken);<% } %>

	app.use((req, res, next) => {
		dbgReq(`${req.ip}\t${req.method}\t${req.url}\t${req.xhr ? 'XHR' : ''}`);
		next();
	});

	app.ready =	Q.resolve()<% if (useDB) { %>
		.then(app.db.connect())
		.then(() => dbgInit('DB initialized!'))<% } %>
		.then(() => require('./api.js')(app))
		.then(() => dbgInit('API initialized!'))
		.then(() => handleRequests(app))
		.then(() => dbgInit('Application initialization complete!'))
		.catch(dbgErr);

	return app;
};

function handleRequests(app) {
	app.get('/*', (req, res) => {
		res.sendFile('/index.html', {root: config.assets}, err => {
			if (err) {
				dbgErr(err);
				if (err.status)
					return res.status(err.status).end();
				res.sendStatus(500);
			}
		});
	});

	// Send 404 for any requests that don't match API or static routes
	app.use((req, res) => {
		res.status(404).send('Not Found');
	});

	// Error handling
	app.use(errors.catchAll);
}
