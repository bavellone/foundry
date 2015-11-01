/*eslint-env node*/
var chai = require('chai'),
	_ = require('lodash'),
	async = require('async'),
	debug = require('debug'),
	config = require('../server/config');

global.chai = chai;
global.expect = chai.expect;
global.app = require('../server/app')();
global._ = _;
global.glob = require('glob');
global.path = require('path');
global.async = async;
global.config = config;
global.debug = debug;
global.request = require('supertest').agent(global.app);

process.env.NODE_ENV = 'testing';
