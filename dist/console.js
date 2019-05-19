"use strict";

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

require('proxy-polyfill/src');

var emojis = require('./lib/emojis');

var scope = typeof window !== 'undefined' ? window : global;

var consoleCopy = _objectSpread({}, scope.console); // Remove console as otherwise it does not work in Node.js


delete scope.console;
scope.console = new Proxy(consoleCopy, {
  get: function get(obj, prop) {
    if (!(prop in obj) && prop in emojis) {
      obj[prop] = function () {
        for (var _len = arguments.length, thisArgs = new Array(_len), _key = 0; _key < _len; _key++) {
          thisArgs[_key] = arguments[_key];
        }

        return consoleCopy.log.apply(consoleCopy, [emojis[prop]].concat(thisArgs));
      };
    }

    return obj[prop];
  }
});
module.exports = scope.console;
