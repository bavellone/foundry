/*eslint-env node*/
/**
 * This module defines a set of common CRUD routes 
 */

import express from 'express';
import debug from 'debug';
import {
  return404
} from './errors';
import {
  ensureParamID
} from './utils';

let dbgCRUD = debug('app:api:crud');

export default function(modelAPI, pre, post) {
  let app = express.Router();
  let crud = wrapModelAPI(modelAPI);

  if (typeof pre == 'function')
    pre(app);

  // Attach routes
  app.get('/', crud.list);
  app.post('/', crud.create);
  app.delete('/', crud.destroyAll);
  app.get('/:id', ensureParamID(), crud.read);
  app.put('/:id', ensureParamID(), crud.update);
  app.delete('/:id', ensureParamID(), crud.destroy);

  if (typeof post == 'function')
    post(app);

  app.use((req, res) => {
    return404(req, res)
  })

  return app;
}

function wrapModelAPI(api) {
  return {
    list: (req, res, next) =>
      dbgCRUD(`listing ${api.schema.type}s`) ||
      api.list().done(::res.json, next),

    create: (req, res, next) =>
      dbgCRUD(`creating ${api.schema.type}`) ||
      api.create(req.body).done(::res.json, next),

    read: (req, res, next) =>
      dbgCRUD(`reading ${api.schema.type}:${req.params.id}`) ||
      api.read(req.params.id).done(::res.json, next),

    update: (req, res, next) =>
      dbgCRUD(`updating ${api.schema.type}:${req.params.id}`) ||
      api.update(req.params.id, req.body).done(::res.json, next),

    destroy: (req, res, next) =>
      dbgCRUD(`deleting ${api.schema.type}:${req.params.id}`) ||
      api.destroy(req.params.id).done(::res.json, next),

    destroyAll: (req, res, next) =>
      dbgCRUD(`deleting all ${api.schema.type}s`) ||
      api.destroyAll().done(::res.json, next)
  }
}
