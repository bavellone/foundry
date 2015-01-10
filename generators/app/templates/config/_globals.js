var chai = require('chai'),
	helpers = require('yeoman-generator').test;

chai.use(require('chai-fs'));
chai.use(require('chai-as-promised'));

global.chai = chai;
global.expect = chai.expect;
global.helpers = helpers;
