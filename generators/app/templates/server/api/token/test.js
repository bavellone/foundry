/*eslint-env node*/

// import {sign, verify} from '../../libs/jwt';
// import {getAPI, responses, genUserData, genImageData, newAuthAgent, generateCRUDTests} from '../../../test/utils'

// describe('Token', () => {
//   var imageData = genImageData();
//   console.log(imageData);
//   // let req = newAgent();
//   var agent = {};
// 
//   before(() => 
//     newAuthAgent(genUserData({roles: ['admin']}))
//       .then(authAgent => {
//         agent.user = authAgent.user;
//         agent.auth = authAgent.auth;
//       })
//   )
//   
// 	it('should create and verify a token', (done) => {
// 		sign({data: 'payload'})
// 			.then(token =>
// 				verify(token))
// 			.then((data) => {
// 				expect(data).to.exist;
// 				expect(data.data).to.equal('payload');
// 			})
// 			.done(done, done)
// 	});
// 	
// 	describe('API', () => {
// 		let token = '',
// 			userData = {email: 'user123@email.com', password: 'abc'};
// 		
// 		before(done => {
// 			sign({data: 'payload'})
// 				.then(t => {
// 					token = t;
// 					done();
// 				})
// 		});
// 
// 		it('should refuse an unauthenticated request', done => {
// 			global.request.get(global.app.locals.api.token + '/')
// 				.expect(401)
// 				.end((err, res) => {
// 					if (err)
// 						console.error(res.body);
// 					done(err);
// 				});
// 		});
// 
// 		it('should allow an authenticated request', done => {
// 			global.request.get(global.app.locals.api.token + '/')
// 				.set('Cookie', `token=${token}`)
// 				.expect(200)
// 				.end((err, res) => {
// 					if (err)
// 						console.error(res.body);
// 					done(err);
// 				});
// 		});
// 		
// 		
// 		it('should return a new token', done => {
// 			global.request.post(global.app.locals.api.user + '/')
// 				.send(userData)
// 				.expect(200)
// 				.expect('Content-type', /json/)
// 				.end((err, res) => {
// 					if (err)
// 						console.error(res.body);
// 
// 					global.request.post(global.app.locals.api.token + '/')
// 						.send(userData)
// 						.expect(200)
// 						.expect((res) => {
// 							expect(res.body).to.have.property('token');
// 						})
// 						.end((err, res) => {
// 							if (err)
// 								console.error(res.body);
// 							done(err);
// 						});
// 				});
// 			
// 			
// 		});
// 		
// 		
// 	})
// });
