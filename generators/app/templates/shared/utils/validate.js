/*eslint-env node browser*/
import joi from 'joi';

export default joi.extend({
  base: joi.string(),
  name: 'string',
  language: {
    hide: 'should be hidden'
  },
  rules: [{
    name: 'hide',
    validate: function(params, value, state, options) {
      return ''
    }
  }]
});
