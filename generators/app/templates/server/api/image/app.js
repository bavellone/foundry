/*eslint-env node*/
import path from 'path';
import mkdirp from 'mkdirp';
import fs from 'fs';
import async from 'async';

import CRUD from '../../libs/crud';
import {
  handleUpload
} from '../../libs/utils';
import ImageSchema from './model';

module.exports = ImageModule;

function ImageModule(app) {
  async.map([
    app.locals.config.uploadDir
  ], mkdirp, err => {
    if (err)
      console.error(err);
  })

  return app.db
    .registerSchema(ImageSchema, 'Image')
    .then(modelAPI =>
      CRUD(modelAPI, app => {
        app.post('/', handleUpload({
          fileSize: 1024 * 1024, // 1MB,
          files: 1
        }), handleImageUpload(modelAPI))
      }))
}

function handleImageUpload(modelAPI) {
  return (req, res, next) => {
    const file = req.files[0];

    if (!file)
      return res.status(400).end()

    modelAPI.create({...req.body, extension: file.extension})
      .then(img => {
        const srcPath = file.path;
        const destPath = path.join(req.app.locals.config.uploadDir, `${img.id}.${file.extension}`);
        
        fs.renameSync(srcPath, destPath)
        res.json(img)
      })
      .catch(next)
  }
}
