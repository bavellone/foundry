/*eslint-env node*/

import {
  getAPI,
  genUserData,
  newAuthAgent,
  generateCRUDTests,
  responses
} from '../../../test/utils'

describe('User', () => {
  describe('API', () => {
    var userData = genUserData({roles: ['admin']});
    // let req = newAgent();
    var agent = {};

    before(() =>
      newAuthAgent(userData)
      .then(authAgent => {
        agent.auth = authAgent.auth;
        agent.user = authAgent.user;
        userData = authAgent.user;
      })
    )

    generateCRUDTests(agent, 'user', userData, genUserData)

    it('should reject an invalid email when trying to create a user', (done) => {
      agent.auth.post(getAPI('user'))
        .send({...genUserData(),
          email: '123'
        })
        .expect(400)
        .end(responses.end(done))
    });

    it('should reject a password which is too short', (done) => {
      agent.auth.post(getAPI('user'))
        .send({...genUserData(),
          password: '123'
        })
        .expect(400)
        .end(responses.end(done))
    });

    it('should not return the user\'s password field', (done) => {
      agent.auth.post(getAPI('user'))
        .send(genUserData())
        .expect(200)
        .expect(res => {
          expect(res.body).to.not.have.property('password');
        })
        .end(responses.end(done))
    });

  })
});

// describe('CRUD', () => {
//   var userData = genUserData(['admin']);
//   // let req = newAgent();
//   var agent = {};
//   
//   before(() => 
//     newAuthAgent(userData)
//       .then(authAgent => {
//         agent.user = authAgent.user;
//         agent.auth = authAgent.auth;
//       })
//   )
//   
//   generateCRUDTests('user', agent)
//   
// })
