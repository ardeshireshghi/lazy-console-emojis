require('proxy-polyfill/src');
const emojis = require('./lib/emojis');

const scope = (typeof window !== 'undefined') ? window : global;
const consoleCopy = {...scope.console};

// Remove console as otherwise it does not work in Node.js
delete scope.console;

scope.console = new Proxy(consoleCopy, {
  get(obj, prop) {
    if (!(prop in obj) && prop in emojis) {
      obj[prop] = (...thisArgs) => consoleCopy.log(emojis[prop], ...thisArgs);
    }
    return obj[prop];
  }
});

module.exports = scope.console;
