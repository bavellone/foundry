/*eslint-env node*/

import {getAPI, responses, genUserData, genImageData, newAuthAgent, generateCRUDTests} from '../../../test/utils'

describe('Image', () => {
  describe('API', () => {
    var imageData = genImageData();
    // let req = newAgent();
    var agent = {};
    
    before(() => 
      newAuthAgent(genUserData({roles: ['admin']}))
        .then(authAgent => {
          agent.user = authAgent.user;
          agent.auth = authAgent.auth;
        })
    )
    
    // generateCRUDTests(agent, 'image', imageData, genImageData)
    
    it('should accept an integer value for size', (done) => {
      const blob = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQYV2NgYAAAAAMAAWgmWQ0AAAAASUVORK5CYII=', 'base64');
      agent.auth.post(getAPI('image'))
        .field('data', JSON.stringify({...genImageData(),
          size: 1024
        }))
        .attach('file', blob)
        .expect(200)
        .end(responses.end(done))
    });
    
    it('should accept a float value for size', (done) => {
      const blob = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQYV2NgYAAAAAMAAWgmWQ0AAAAASUVORK5CYII=', 'base64');
      agent.auth.post(getAPI('image'))
        .field('data', JSON.stringify({...genImageData(),
          size: 1024.55
        }))
        .attach('file', blob)
        .expect(200)
        .end(responses.end(done))
    });
    
  })
})
