/*eslint-env node*/
import path from 'path';

import uuid from 'node-uuid';
import q from 'q';
import _ from 'lodash';

export const responses = {
  success: function(res) {
    expect(JSON.parse(res.text)
        .success)
      .to.be.ok;
  },
  hasContent: function(res) {
    expect(JSON.parse(res.text))
      .to.not.be.empty;
  },
  hasError: function(res) {
    expect(res.body.code)
      .to.be.above(300);
  },
  end: done => (err, res) => {
    if (err) {
      if (res && res.body.code)
        return done(new Error(`${res.body.code} ${res.body.name}: ${res.body.desc}`))
      return done(err)
    }

    done(null, res)
  }
};

export function genUserData(data) {
  return {
    email: getUID('user') + '@test.com',
    password: getUID('password'),
    ...data
  }
}

export function genImageData(data) {
  return {
    name: getUID('image') + '@test.com',
    size: parseInt(Math.random() * 100000 + 1),
    ...data
  }
}

export function getUID(base) {
  return base + '-' + uuid.v4();
}

export function promisify(req) {
  var deferred = q.defer();
  req
    .end((err, data) => {
      if (err)
        return deferred.reject(err)

      deferred.resolve(data);
    });

  return deferred.promise;
}

export function newAuthAgent(userData = genUserData(['admin'])) {
  var user;
  return createUser(userData)
    .then(res => {
      user = res.body;
      return authenticate(userData)
    })
    .then(auth => ({
      user,
      auth
    }));
}

export function createUser(userData) {
  return promisify(
    newAgent()
    .post(getAPI('user'))
    .set('X-AUTH', '1')
    .send(userData)
  )
}

export function authenticate(userData) {
  var auth = newAgent();
  return promisify(
      auth.post(getAPI('user', 'login'))
      .send(userData)
    )
    .then(() => auth)
}

export function newAgent() {
  return global.request.agent(global.app)
}

export function getAPI(name, ...paths) {
  return path.join(global.app.locals.api[name], ...paths)
}

export function clearModels(name, auth) {
  return auth.delete(getAPI(name))
}

export function generateCRUDTests(agent, name, testData, genData) {
  describe('CRUD', function() {
    let response = q.defer(),
      ready = response.promise,
      data;

    this.slow(50);

    it(`should create a new ${name}`, function(done) {
      agent.auth.post(getAPI(name))
        .send(testData)
        .expect(200)
        .expect(responses.hasContent)
        .end(responses.end((err, res) => {
          if (!err) {
            data = res.body;
            response.resolve();
          }
          else 
            response.reject(err)
          done();
        }))
    });

    it(`should retrieve a list of ${name}s`, function(done) {
      ready.then(() => {
        agent.auth.get(getAPI(name))
          .expect(200)
          .expect(responses.hasContent)
          .end(global.utils.responses.end(done))
      }, done)
    });

    it(`should retrieve a ${name}`, (done) => {
      ready.then(() => {
        agent.auth.get(getAPI(name, data.id))
          .expect(200)
          .expect('Content-type', /json/)
          .end(responses.end(done))
      }, done)
    });

    it(`should update a ${name}`, (done) => {
      let newData = genData();
      ready.then(() => {
        agent.auth.put(getAPI(name, data.id))
          .send(newData)
          .expect(200)
          .expect(res => {
              expect(res.body.id)
                .to.equal(data.id)
          })
          .end(responses.end(done))
      }, done)
    });

    it(`should return an error when sending invalid ${name}ID`, (done) => {
      ready.then(() => {
        agent.auth.get(getAPI(name, 'test123'))
          .expect(404)
          .expect('Content-type', /json/)
          .end(responses.end(done))
      }, done)
    });

    it(`should remove a ${name}`, (done) => {
      ready.then(() => {
        agent.auth.delete(getAPI(name, data.id))
          .expect(200)
          .expect('Content-type', /json/)
          .end(responses.end(done))
      }, done)
    });

  });
}
