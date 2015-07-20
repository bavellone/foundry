var path = require('path');

describe('foundry setup', function () {
	before(function (done) {
		helpers.run(path.join(__dirname, '../generators/app'))
			.inDir(path.join(__dirname, './tmp/app'))
			.withPrompt({appName: 'testApp', appNS: 'testNS'})
			.on('end', done);
		this.timeout(100000);
	});

	describe('foundry:app', function () {
		describe('files and directories', function () {
			it('creates all directories', function () {
				expect('public').to.be.a.directory;
				expect('server/libs').to.be.a.directory().and.not.empty;
				expect('server/config').to.be.a.directory().and.not.empty;
				expect('server/config/env').to.be.a.directory().and.not.empty;
			});
			it('minifies vendor JS', function () {
				expect('public/assets/index.html').to.be.a.file;
				expect('public/assets/js/vendor.bundle.js').to.be.a.file;
				expect('public/assets/css/vendor.bundle.css').to.be.a.file;
			});
			it('copies server scripts', function () {
				expect('server/app.js').to.be.a.file;
				expect('server/api.js').to.be.a.file;
				expect('server/api/module/api.js').to.be.a.file;
			});
		});
	});
});
