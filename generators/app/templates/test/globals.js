/*eslint-env node*/
process.env.NODE_ENV = 'testing';

delete require.cache[require.resolve('../server/config')];
const config = require('../server/config');

global.chai = require('chai');
global.expect = global.chai.expect;
global.app = require('../server/app')(config);
global.request = require('supertest');
global._ = require('lodash');
global.async = require('async');
global.config = config;
global.debug = require('debug');
global.utils = require('./utils');

// Make sure app is initialized before running any tests
before(() => global.app.ready);
after(global.app.db.disconnect);
