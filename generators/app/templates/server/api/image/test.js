/*eslint-env node*/

import {getAPI, responses, genUserData, genImageData, newAuthAgent, generateCRUDTests} from '../../../test/utils'

describe('Image', () => {
  describe('API', () => {
    var imageData = genImageData();
    console.log(imageData);
    // let req = newAgent();
    var agent = {};
    
    before(() => 
      newAuthAgent(genUserData({roles: ['admin']}))
        .then(authAgent => {
          agent.user = authAgent.user;
          agent.auth = authAgent.auth;
        })
    )
    
    generateCRUDTests(agent, 'image', imageData, genImageData)
    
    it('should accept an integer value for size', (done) => {
      agent.auth.post(getAPI('image'))
        .send({...genImageData(),
          size: 1024
        })
        .expect(200)
        .end(responses.end(done))
    });
    
    it('should accept a float value for size', (done) => {
      agent.auth.post(getAPI('image'))
        .send({...genImageData(),
          size: 1024.55
        })
        .expect(200)
        .end(responses.end(done))
    });
    
  })
})
