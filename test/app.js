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
		this.timeout(60000);
	});

	describe('foundry:app', function () {
		describe('files and directories', function () {
			it('should create a public directory', function () {
				expect('./public').to.be.a.directory;
			});
			it('should minify vendor JS', function () {
				expect('public/assets/js/vendor.bundle.js').to.be.a.file();
			});
			it('should minify vendor CSS', function () {
				expect('public/assets/css/vendor.bundle.css').to.be.a.file();
			});
		});

		describe('sub-generators', function () {
			it('should create a new module', function () {
				expect('./public/app/core').to.be.a.directory().and.not.empty;
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
				modURL: 'test',
				modState: 'test'
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
