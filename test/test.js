var path = require('path');

var deps = [
	'../../../generators/ngMod'
	];

describe('foundry setup', function () {
	before(function (done) {
		helpers.run(path.join(__dirname, '../generators/app'))
			.withGenerators(deps)
			.inDir(path.join(__dirname, './tmp/app'))
			.withPrompt({appName: 'testApp'})
			.on('end', done);
		this.timeout(100000);
	});

	describe('foundry:app', function () {
		describe('files and directories', function () {
			it('creates all directories', function () {
				expect('test/server').to.be.a.directory;
				expect('test/client').to.be.a.directory;
				expect('test/globals.js').to.be.a.file;
				expect('test/mocha.opts').to.be.a.file;
				expect('public').to.be.a.directory;
				expect('public/assets').to.be.a.directory;
				expect('server/libs').to.be.a.directory().and.not.empty;
				expect('server/config').to.be.a.directory().and.not.empty;
				expect('server/config/env').to.be.a.directory().and.not.empty;
			});
			it('minifies vendor JS', function () {
				expect('public/assets/js/vendor.bundle.js').to.be.a.file();
			});
			it('minifies vendor CSS', function () {
				expect('public/assets/css/vendor.bundle.css').to.be.a.file();
			});
			it('copies server scripts', function () {
				expect('server/init.js').to.be.a.file();
				expect('server/api.js').to.be.a.file();
			});
		});

		describe('sub-generators', function () {
			it('creates a new module', function () {
				expect('public/app/core').to.be.a.directory().and.not.empty;
			});
		})
	});
});

describe('ngMod setup', function () {
	before(function (done) {
		helpers.run(path.join(__dirname, '../generators/ngMod'))
			.inDir(path.join(__dirname, './tmp/ngMod'))
			.withPrompt({
				modName: 'test',
				useRouter: true,
				modUrl: ''
			})
			.on('end', done);
	});

	describe('foundry:ngMod', function () {
		describe('files and directories', function () {
			it('creates module files', function () {
				expect('./public/app/test').to.be.a.directory().and.not.empty;
			});
		});
	});
});
