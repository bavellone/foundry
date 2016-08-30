/*eslint-env node*/
import _ from 'lodash';
import glob from 'glob';
import path from 'path';
import busboy from 'busboy';
import fs from 'fs';
import uuid from 'uuid';
import mime from 'mime';

import {MissingParameterError, MissingIDError, RequestDataTooLarge} from './errors';


export function globMap(globPath, callback) {
	return _.map(glob.sync(globPath), function (appPath) {
		var paths = {
			file: path.resolve(appPath).split(path.sep).pop().split('.')[0],
			full: path.resolve(appPath),
			dir: path.dirname(path.resolve(appPath)).split(path.sep).pop()
		};
		return callback(paths);
	});
}

export function globReduce(globPath, callback) {
	return _.reduce(glob.sync(globPath), function (map, appPath) {
		var paths = {
			file: path.resolve(appPath).split(path.sep).pop().split('.')[0],
			full: path.resolve(appPath),
			dir: path.dirname(path.resolve(appPath)).split(path.sep).pop()
		};
		return callback(map, paths);
	}, {});
}

export function ensurePostData(...data) {
	return (req, res, next) => {
		if (_(data).every(param => {
				if (!_.isUndefined(req.body[param]) && !_.isNull(req.body[param]))
					return true;
				else
					return next(new MissingParameterError(param)) && false;
			}))
			next();
	}
}

export function ensureParamData(...data) {
	return (req, res, next) => {
		if (_(data).every(param => {
				if (!_.isUndefined(req.params[param]) && !_.isNull(req.params[param]))
					return true;
				else
					return next(new MissingParameterError(param)) && false;
			}))
			next();
	}
}

export function ensureParamID() {
	return (req, res, next) => {
		if (!req.params.id)
			return next(new MissingIDError());
		next();
	}
}

export function handleUpload(limits) {
  return (req, res, next) => {
    let upload = new busboy({
      headers: req.headers,
      limits
    });
    req.files = [];
    
    upload
      .on('file', (fieldname, file, filename, encoding, mimetype) => {
        const filePath = path.join(
          req.app.locals.config.uploadDir, 
          `${uuid.v4()}.tmp`);
        const storage = fs.createWriteStream(filePath);
        
        file
          .on('limit', () => {
            next(new RequestDataTooLarge(`Size limit: ${limits.fileSize/1024} KB`))
            fs.unlink(filePath)
          })
          .on('end', () => req.files.push({
              name: filename || 'file',
              path: filePath,
              extension: mime.extension(mimetype),
              mimetype,
              encoding
            }))
          .on('error', err => console.error(err))
          .pipe(storage);
      })
      .on('field', (fieldname, val) => {
        if (fieldname == 'data')
          req.body = JSON.parse(val);
      })
      .on('finish', next);
    
    req.pipe(upload)
  }
}
