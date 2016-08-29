/*eslint-env browser,node*/

import {create} from 'apisauce';
import schemas from '../../shared/schemas';
import debug from 'debug';

const dbg = debug('app:api');

export class CRUDAPI {
  model = null;
  constructor(model) {
    this.model = model;
    this.api = create({
      baseURL: this.path,
      headers: {
        'X-Version': '1.0.0'
      }
    })
  }
  static transformResponse = res => res.data;
  get path() {
    return `/api/${this.model.type.toLowerCase()}`
  }
  list = () => 
    dbg(`GET ${this.path}/`) ||
    this.api.get('/')
      .then(CRUDAPI.transformResponse)
  
  read = id =>
    dbg(`GET ${this.path}/${id}`) ||
    this.api.get(`/${id}`)
      .then(CRUDAPI.transformResponse)
  
  create = data =>
    dbg(`POST ${this.path}/`) ||
    this.api.post('/', data)
      .then(CRUDAPI.transformResponse)
  
  update = (id, data) =>
    dbg(`PUT ${this.path}/${id}`) ||
    this.api.put(`/${id}`, data)
      .then(CRUDAPI.transformResponse)
  
  destroy = id =>
    dbg(`DELETE ${this.path}/${id}`) ||
    this.api.delete(`/${id}`)
      .then(CRUDAPI.transformResponse)
  
  destroyAll = () =>
    dbg(`DELETE ${this.path}/`) ||
    this.api.delete('/')
      .then(CRUDAPI.transformResponse)
}

export default schemas
  .reduce((rv, schema) => {
    rv[schema.type] = new CRUDAPI(schema);
    return rv;
  }, {})
