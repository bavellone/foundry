/*eslint-env node*/
// TODO - need to add proper logging support, i.e. add a logging lib and routes all logs through handlers

var path = require('path'),
	express = require('express'),
	bodyParser = require('body-parser'),
	cookieParser = require('cookie-parser'),
	http = require('http'),
	debug = require('debug'),
	dbgInit = debug('app:init'),
	dbgErr = debug('app:error'),
	dbgReq = debug('app:request');

<% if (useDB) { %>
import DB from './db';
import DBAdapter from './db/<%= DBAdapterPath %>';<% } if (useAuth) { %>
import {readToken} from './libs/auth';<% } %>

import attachAPI from './api';
import attachRouter from './router';

module.exports = function (config) {
	dbgInit('Creating new app');
	var app = express();
	
	app.locals.config = config;

	// Get rid of express header
	app.disable('x-powered-by');

	// Use IP address from HAProxy X-Forwarded-For header
	app.enable('trust proxy');
	<% if (useDB) { %>
	app.db = new DB({
    uri: config.db,
		adapter: new DBAdapter(config.db)
	});<% } %>

	http.globalAgent.maxSockets = config.connectionPool;

	app.use('/assets', express.static(path.resolve(config.assets)));
	app.use('/assets', express.static(path.resolve(config.dataDir)));
	app.get('/assets/favicon.png', (req, res) => {
		res.sendStatus(404).end();
	});

	// Setup parsers
	app.use(bodyParser.json());

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
  
  dbgInit('App configured');

  app.ready =	Promise.resolve()
    .then(() => dbgInit('App initializing'))<% if (useDB) { %>
  	.then(app.db.connect())
  	.then(() => dbgInit('DB initialized!'))<% } %>
  	.then(() => app.db.connect())
  	.then(() => dbgInit('DB initialized!'))
  	.then(() => attachAPI(app))
  	.then(() => dbgInit('API initialized!'))
  	.then(() => attachRouter(app))
  	.then(() => dbgInit('Application initialization complete!'))
  	.catch(dbgErr);

	return app;
};
