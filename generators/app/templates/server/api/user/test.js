/*eslint-env node*/

describe('API', () => {
	describe('UserAPI', () => {
		it('should return a list of modules', (done) => {
			global.request.get(global.app.locals.api.image + '/list')
				.expect(200)
				.expect('Content-type', /json/)
				.end(done);
		})
	})
});
