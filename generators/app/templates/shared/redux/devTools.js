/*eslint-env node browser*/
if (process.env.NODE_ENV === 'production') {
  module.exports = function() {
    return null
  };
} else {
  module.exports = require('./devTools.dev');
}
