(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],2:[function(require,module,exports){
(function (process,global){
/*
 * Copyright 2018 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

'use strict';

(function(scope) {
  if (scope['Proxy']) {
    return;
  }
  scope.Proxy = require('./proxy.js')();
  scope.Proxy['revocable'] = scope.Proxy.revocable;
})(
  ('undefined' !== typeof process &&
    '[object process]' === {}.toString.call(process)) ||
  ('undefined' !== typeof navigator && navigator.product === 'ReactNative')
    ? global
    : self
);


}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./proxy.js":3,"_process":1}],3:[function(require,module,exports){
/*
 * Copyright 2016 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

module.exports = function proxyPolyfill() {
  let lastRevokeFn = null;
  let ProxyPolyfill;

  /**
   * @param {*} o
   * @return {boolean} whether this is probably a (non-null) Object
   */
  function isObject(o) {
    return o ? (typeof o === 'object' || typeof o === 'function') : false;
  }

  /**
   * @constructor
   * @param {!Object} target
   * @param {{apply, construct, get, set}} handler
   */
  ProxyPolyfill = function(target, handler) {
    if (!isObject(target) || !isObject(handler)) {
      throw new TypeError('Cannot create proxy with a non-object as target or handler');
    }

    // Construct revoke function, and set lastRevokeFn so that Proxy.revocable can steal it.
    // The caller might get the wrong revoke function if a user replaces or wraps scope.Proxy
    // to call itself, but that seems unlikely especially when using the polyfill.
    let throwRevoked = function() {};
    lastRevokeFn = function() {
      throwRevoked = function(trap) {
        throw new TypeError(`Cannot perform '${trap}' on a proxy that has been revoked`);
      };
    };

    // Fail on unsupported traps: Chrome doesn't do this, but ensure that users of the polyfill
    // are a bit more careful. Copy the internal parts of handler to prevent user changes.
    const unsafeHandler = handler;
    handler = { 'get': null, 'set': null, 'apply': null, 'construct': null };
    for (let k in unsafeHandler) {
      if (!(k in handler)) {
        throw new TypeError(`Proxy polyfill does not support trap '${k}'`);
      }
      handler[k] = unsafeHandler[k];
    }
    if (typeof unsafeHandler === 'function') {
      // Allow handler to be a function (which has an 'apply' method). This matches what is
      // probably a bug in native versions. It treats the apply call as a trap to be configured.
      handler.apply = unsafeHandler.apply.bind(unsafeHandler);
    }

    // Define proxy as this, or a Function (if either it's callable, or apply is set).
    // TODO(samthor): Closure compiler doesn't know about 'construct', attempts to rename it.
    let proxy = this;
    let isMethod = false;
    let isArray = false;
    if (typeof target === 'function') {
      proxy = function ProxyPolyfill() {
        const usingNew = (this && this.constructor === proxy);
        const args = Array.prototype.slice.call(arguments);
        throwRevoked(usingNew ? 'construct' : 'apply');

        if (usingNew && handler['construct']) {
          return handler['construct'].call(this, target, args);
        } else if (!usingNew && handler.apply) {
          return handler.apply(target, this, args);
        }

        // since the target was a function, fallback to calling it directly.
        if (usingNew) {
          // inspired by answers to https://stackoverflow.com/q/1606797
          args.unshift(target);  // pass class as first arg to constructor, although irrelevant
          // nb. cast to convince Closure compiler that this is a constructor
          const f = /** @type {!Function} */ (target.bind.apply(target, args));
          return new f();
        }
        return target.apply(this, args);
      };
      isMethod = true;
    } else if (target instanceof Array) {
      proxy = [];
      isArray = true;
    }

    // Create default getters/setters. Create different code paths as handler.get/handler.set can't
    // change after creation.
    const getter = handler.get ? function(prop) {
      throwRevoked('get');
      return handler.get(this, prop, proxy);
    } : function(prop) {
      throwRevoked('get');
      return this[prop];
    };
    const setter = handler.set ? function(prop, value) {
      throwRevoked('set');
      const status = handler.set(this, prop, value, proxy);
      // TODO(samthor): If the calling code is in strict mode, throw TypeError.
      // if (!status) {
        // It's (sometimes) possible to work this out, if this code isn't strict- try to load the
        // callee, and if it's available, that code is non-strict. However, this isn't exhaustive.
      // }
    } : function(prop, value) {
      throwRevoked('set');
      this[prop] = value;
    };

    // Clone direct properties (i.e., not part of a prototype).
    const propertyNames = Object.getOwnPropertyNames(target);
    const propertyMap = {};
    propertyNames.forEach(function(prop) {
      if ((isMethod || isArray) && prop in proxy) {
        return;  // ignore properties already here, e.g. 'bind', 'prototype' etc
      }
      const real = Object.getOwnPropertyDescriptor(target, prop);
      const desc = {
        enumerable: !!real.enumerable,
        get: getter.bind(target, prop),
        set: setter.bind(target, prop),
      };
      Object.defineProperty(proxy, prop, desc);
      propertyMap[prop] = true;
    });

    // Set the prototype, or clone all prototype methods (always required if a getter is provided).
    // TODO(samthor): We don't allow prototype methods to be set. It's (even more) awkward.
    // An alternative here would be to _just_ clone methods to keep behavior consistent.
    let prototypeOk = true;
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(proxy, Object.getPrototypeOf(target));
    } else if (proxy.__proto__) {
      proxy.__proto__ = target.__proto__;
    } else {
      prototypeOk = false;
    }
    if (handler.get || !prototypeOk) {
      for (let k in target) {
        if (propertyMap[k]) {
          continue;
        }
        Object.defineProperty(proxy, k, { get: getter.bind(target, k) });
      }
    }

    // The Proxy polyfill cannot handle adding new properties. Seal the target and proxy.
    Object.seal(target);
    Object.seal(proxy);

    return proxy;  // nb. if isMethod is true, proxy != this
  };

  ProxyPolyfill.revocable = function(target, handler) {
    const p = new ProxyPolyfill(target, handler);
    return { 'proxy': p, 'revoke': lastRevokeFn };
  };

  return ProxyPolyfill;
}
},{}],4:[function(require,module,exports){
(function (global){
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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./lib/emojis":5,"proxy-polyfill/src":2}],5:[function(require,module,exports){
module.exports={
	"100": "💯",
	"1234": "🔢",
	"grinning": "😀",
	"grimacing": "😬",
	"grin": "😁",
	"joy": "😂",
	"rofl": "🤣",
	"smiley": "😃",
	"smile": "😄",
	"sweat_smile": "😅",
	"laughing": "😆",
	"innocent": "😇",
	"wink": "😉",
	"blush": "😊",
	"slightly_smiling_face": "🙂",
	"upside_down_face": "🙃",
	"relaxed": "☺️",
	"yum": "😋",
	"relieved": "😌",
	"heart_eyes": "😍",
	"kissing_heart": "😘",
	"kissing": "😗",
	"kissing_smiling_eyes": "😙",
	"kissing_closed_eyes": "😚",
	"stuck_out_tongue_winking_eye": "😜",
	"stuck_out_tongue_closed_eyes": "😝",
	"stuck_out_tongue": "😛",
	"money_mouth_face": "🤑",
	"nerd_face": "🤓",
	"sunglasses": "😎",
	"clown_face": "🤡",
	"cowboy_hat_face": "🤠",
	"hugs": "🤗",
	"smirk": "😏",
	"no_mouth": "😶",
	"neutral_face": "😐",
	"expressionless": "😑",
	"unamused": "😒",
	"roll_eyes": "🙄",
	"thinking": "🤔",
	"lying_face": "🤥",
	"flushed": "😳",
	"disappointed": "😞",
	"worried": "😟",
	"angry": "😠",
	"rage": "😡",
	"pensive": "😔",
	"confused": "😕",
	"slightly_frowning_face": "🙁",
	"frowning_face": "☹",
	"persevere": "😣",
	"confounded": "😖",
	"tired_face": "😫",
	"weary": "😩",
	"triumph": "😤",
	"open_mouth": "😮",
	"scream": "😱",
	"fearful": "😨",
	"cold_sweat": "😰",
	"hushed": "😯",
	"frowning": "😦",
	"anguished": "😧",
	"cry": "😢",
	"disappointed_relieved": "😥",
	"drooling_face": "🤤",
	"sleepy": "😪",
	"sweat": "😓",
	"sob": "😭",
	"dizzy_face": "😵",
	"astonished": "😲",
	"zipper_mouth_face": "🤐",
	"nauseated_face": "🤢",
	"sneezing_face": "🤧",
	"mask": "😷",
	"face_with_thermometer": "🤒",
	"face_with_head_bandage": "🤕",
	"sleeping": "😴",
	"zzz": "💤",
	"poop": "💩",
	"smiling_imp": "😈",
	"imp": "👿",
	"japanese_ogre": "👹",
	"japanese_goblin": "👺",
	"skull": "💀",
	"ghost": "👻",
	"alien": "👽",
	"robot": "🤖",
	"smiley_cat": "😺",
	"smile_cat": "😸",
	"joy_cat": "😹",
	"heart_eyes_cat": "😻",
	"smirk_cat": "😼",
	"kissing_cat": "😽",
	"scream_cat": "🙀",
	"crying_cat_face": "😿",
	"pouting_cat": "😾",
	"raised_hands": "🙌",
	"clap": "👏",
	"wave": "👋",
	"call_me_hand": "🤙",
	"+1": "👍",
	"-1": "👎",
	"facepunch": "👊",
	"fist": "✊",
	"fist_left": "🤛",
	"fist_right": "🤜",
	"v": "✌",
	"ok_hand": "👌",
	"raised_hand": "✋",
	"raised_back_of_hand": "🤚",
	"open_hands": "👐",
	"muscle": "💪",
	"pray": "🙏",
	"handshake": "🤝",
	"point_up": "☝",
	"point_up_2": "👆",
	"point_down": "👇",
	"point_left": "👈",
	"point_right": "👉",
	"fu": "🖕",
	"raised_hand_with_fingers_splayed": "🖐",
	"metal": "🤘",
	"crossed_fingers": "🤞",
	"vulcan_salute": "🖖",
	"writing_hand": "✍",
	"selfie": "🤳",
	"nail_care": "💅",
	"lips": "👄",
	"tongue": "👅",
	"ear": "👂",
	"nose": "👃",
	"eye": "👁",
	"eyes": "👀",
	"bust_in_silhouette": "👤",
	"busts_in_silhouette": "👥",
	"speaking_head": "🗣",
	"baby": "👶",
	"boy": "👦",
	"girl": "👧",
	"man": "👨",
	"woman": "👩",
	"blonde_woman": "👱‍",
	"blonde_man": "👱",
	"older_man": "👴",
	"older_woman": "👵",
	"man_with_gua_pi_mao": "👲",
	"woman_with_turban": "👳‍",
	"man_with_turban": "👳",
	"policewoman": "👮‍",
	"policeman": "👮",
	"construction_worker_woman": "👷‍",
	"construction_worker_man": "👷",
	"guardswoman": "💂‍",
	"guardsman": "💂",
	"female_detective": "🕵️‍",
	"male_detective": "🕵",
	"woman_health_worker": "👩‍⚕️",
	"man_health_worker": "👨‍⚕️",
	"woman_farmer": "👩‍🌾",
	"man_farmer": "👨‍🌾",
	"woman_cook": "👩‍🍳",
	"man_cook": "👨‍🍳",
	"woman_student": "👩‍🎓",
	"man_student": "👨‍🎓",
	"woman_singer": "👩‍🎤",
	"man_singer": "👨‍🎤",
	"woman_teacher": "👩‍🏫",
	"man_teacher": "👨‍🏫",
	"woman_factory_worker": "👩‍🏭",
	"man_factory_worker": "👨‍🏭",
	"woman_technologist": "👩‍💻",
	"man_technologist": "👨‍💻",
	"woman_office_worker": "👩‍💼",
	"man_office_worker": "👨‍💼",
	"woman_mechanic": "👩‍🔧",
	"man_mechanic": "👨‍🔧",
	"woman_scientist": "👩‍🔬",
	"man_scientist": "👨‍🔬",
	"woman_artist": "👩‍🎨",
	"man_artist": "👨‍🎨",
	"woman_firefighter": "👩‍🚒",
	"man_firefighter": "👨‍🚒",
	"woman_pilot": "👩‍✈️",
	"man_pilot": "👨‍✈️",
	"woman_astronaut": "👩‍🚀",
	"man_astronaut": "👨‍🚀",
	"woman_judge": "👩‍⚖️",
	"man_judge": "👨‍⚖️",
	"mrs_claus": "🤶",
	"santa": "🎅",
	"angel": "👼",
	"pregnant_woman": "🤰",
	"princess": "👸",
	"prince": "🤴",
	"bride_with_veil": "👰",
	"man_in_tuxedo": "🤵",
	"running_woman": "🏃‍",
	"running_man": "🏃",
	"walking_woman": "🚶‍",
	"walking_man": "🚶",
	"dancer": "💃",
	"man_dancing": "🕺",
	"dancing_women": "👯",
	"dancing_men": "👯‍",
	"couple": "👫",
	"two_men_holding_hands": "👬",
	"two_women_holding_hands": "👭",
	"bowing_woman": "🙇‍",
	"bowing_man": "🙇",
	"man_facepalming": "🤦",
	"woman_facepalming": "🤦‍",
	"woman_shrugging": "🤷",
	"man_shrugging": "🤷‍",
	"tipping_hand_woman": "💁",
	"tipping_hand_man": "💁‍",
	"no_good_woman": "🙅",
	"no_good_man": "🙅‍",
	"ok_woman": "🙆",
	"ok_man": "🙆‍",
	"raising_hand_woman": "🙋",
	"raising_hand_man": "🙋‍",
	"pouting_woman": "🙎",
	"pouting_man": "🙎‍",
	"frowning_woman": "🙍",
	"frowning_man": "🙍‍",
	"haircut_woman": "💇",
	"haircut_man": "💇‍",
	"massage_woman": "💆",
	"massage_man": "💆‍",
	"couple_with_heart_woman_man": "💑",
	"couple_with_heart_woman_woman": "👩‍❤️‍👩",
	"couple_with_heart_man_man": "👨‍❤️‍👨",
	"couplekiss_man_woman": "💏",
	"couplekiss_woman_woman": "👩‍❤️‍💋‍👩",
	"couplekiss_man_man": "👨‍❤️‍💋‍👨",
	"family_man_woman_boy": "👪",
	"family_man_woman_girl": "👨‍👩‍👧",
	"family_man_woman_girl_boy": "👨‍👩‍👧‍👦",
	"family_man_woman_boy_boy": "👨‍👩‍👦‍👦",
	"family_man_woman_girl_girl": "👨‍👩‍👧‍👧",
	"family_woman_woman_boy": "👩‍👩‍👦",
	"family_woman_woman_girl": "👩‍👩‍👧",
	"family_woman_woman_girl_boy": "👩‍👩‍👧‍👦",
	"family_woman_woman_boy_boy": "👩‍👩‍👦‍👦",
	"family_woman_woman_girl_girl": "👩‍👩‍👧‍👧",
	"family_man_man_boy": "👨‍👨‍👦",
	"family_man_man_girl": "👨‍👨‍👧",
	"family_man_man_girl_boy": "👨‍👨‍👧‍👦",
	"family_man_man_boy_boy": "👨‍👨‍👦‍👦",
	"family_man_man_girl_girl": "👨‍👨‍👧‍👧",
	"family_woman_boy": "👩‍👦",
	"family_woman_girl": "👩‍👧",
	"family_woman_girl_boy": "👩‍👧‍👦",
	"family_woman_boy_boy": "👩‍👦‍👦",
	"family_woman_girl_girl": "👩‍👧‍👧",
	"family_man_boy": "👨‍👦",
	"family_man_girl": "👨‍👧",
	"family_man_girl_boy": "👨‍👧‍👦",
	"family_man_boy_boy": "👨‍👦‍👦",
	"family_man_girl_girl": "👨‍👧‍👧",
	"womans_clothes": "👚",
	"tshirt": "👕",
	"jeans": "👖",
	"necktie": "👔",
	"dress": "👗",
	"bikini": "👙",
	"kimono": "👘",
	"lipstick": "💄",
	"kiss": "💋",
	"footprints": "👣",
	"high_heel": "👠",
	"sandal": "👡",
	"boot": "👢",
	"mans_shoe": "👞",
	"athletic_shoe": "👟",
	"womans_hat": "👒",
	"tophat": "🎩",
	"rescue_worker_helmet": "⛑",
	"mortar_board": "🎓",
	"crown": "👑",
	"school_satchel": "🎒",
	"pouch": "👝",
	"purse": "👛",
	"handbag": "👜",
	"briefcase": "💼",
	"eyeglasses": "👓",
	"dark_sunglasses": "🕶",
	"ring": "💍",
	"closed_umbrella": "🌂",
	"dog": "🐶",
	"cat": "🐱",
	"mouse": "🐭",
	"hamster": "🐹",
	"rabbit": "🐰",
	"fox_face": "🦊",
	"bear": "🐻",
	"panda_face": "🐼",
	"koala": "🐨",
	"tiger": "🐯",
	"lion": "🦁",
	"cow": "🐮",
	"pig": "🐷",
	"pig_nose": "🐽",
	"frog": "🐸",
	"squid": "🦑",
	"octopus": "🐙",
	"shrimp": "🦐",
	"monkey_face": "🐵",
	"gorilla": "🦍",
	"see_no_evil": "🙈",
	"hear_no_evil": "🙉",
	"speak_no_evil": "🙊",
	"monkey": "🐒",
	"chicken": "🐔",
	"penguin": "🐧",
	"bird": "🐦",
	"baby_chick": "🐤",
	"hatching_chick": "🐣",
	"hatched_chick": "🐥",
	"duck": "🦆",
	"eagle": "🦅",
	"owl": "🦉",
	"bat": "🦇",
	"wolf": "🐺",
	"boar": "🐗",
	"horse": "🐴",
	"unicorn": "🦄",
	"honeybee": "🐝",
	"bug": "🐛",
	"butterfly": "🦋",
	"snail": "🐌",
	"beetle": "🐞",
	"ant": "🐜",
	"spider": "🕷",
	"scorpion": "🦂",
	"crab": "🦀",
	"snake": "🐍",
	"lizard": "🦎",
	"turtle": "🐢",
	"tropical_fish": "🐠",
	"fish": "🐟",
	"blowfish": "🐡",
	"dolphin": "🐬",
	"shark": "🦈",
	"whale": "🐳",
	"whale2": "🐋",
	"crocodile": "🐊",
	"leopard": "🐆",
	"tiger2": "🐅",
	"water_buffalo": "🐃",
	"ox": "🐂",
	"cow2": "🐄",
	"deer": "🦌",
	"dromedary_camel": "🐪",
	"camel": "🐫",
	"elephant": "🐘",
	"rhinoceros": "🦏",
	"goat": "🐐",
	"ram": "🐏",
	"sheep": "🐑",
	"racehorse": "🐎",
	"pig2": "🐖",
	"rat": "🐀",
	"mouse2": "🐁",
	"rooster": "🐓",
	"turkey": "🦃",
	"dove": "🕊",
	"dog2": "🐕",
	"poodle": "🐩",
	"cat2": "🐈",
	"rabbit2": "🐇",
	"chipmunk": "🐿",
	"paw_prints": "🐾",
	"dragon": "🐉",
	"dragon_face": "🐲",
	"cactus": "🌵",
	"christmas_tree": "🎄",
	"evergreen_tree": "🌲",
	"deciduous_tree": "🌳",
	"palm_tree": "🌴",
	"seedling": "🌱",
	"herb": "🌿",
	"shamrock": "☘",
	"four_leaf_clover": "🍀",
	"bamboo": "🎍",
	"tanabata_tree": "🎋",
	"leaves": "🍃",
	"fallen_leaf": "🍂",
	"maple_leaf": "🍁",
	"ear_of_rice": "🌾",
	"hibiscus": "🌺",
	"sunflower": "🌻",
	"rose": "🌹",
	"wilted_flower": "🥀",
	"tulip": "🌷",
	"blossom": "🌼",
	"cherry_blossom": "🌸",
	"bouquet": "💐",
	"mushroom": "🍄",
	"chestnut": "🌰",
	"jack_o_lantern": "🎃",
	"shell": "🐚",
	"spider_web": "🕸",
	"earth_americas": "🌎",
	"earth_africa": "🌍",
	"earth_asia": "🌏",
	"full_moon": "🌕",
	"waning_gibbous_moon": "🌖",
	"last_quarter_moon": "🌗",
	"waning_crescent_moon": "🌘",
	"new_moon": "🌑",
	"waxing_crescent_moon": "🌒",
	"first_quarter_moon": "🌓",
	"waxing_gibbous_moon": "🌔",
	"new_moon_with_face": "🌚",
	"full_moon_with_face": "🌝",
	"first_quarter_moon_with_face": "🌛",
	"last_quarter_moon_with_face": "🌜",
	"sun_with_face": "🌞",
	"crescent_moon": "🌙",
	"star": "⭐",
	"star2": "🌟",
	"dizzy": "💫",
	"sparkles": "✨",
	"comet": "☄",
	"sunny": "☀️",
	"sun_behind_small_cloud": "🌤",
	"partly_sunny": "⛅",
	"sun_behind_large_cloud": "🌥",
	"sun_behind_rain_cloud": "🌦",
	"cloud": "☁️",
	"cloud_with_rain": "🌧",
	"cloud_with_lightning_and_rain": "⛈",
	"cloud_with_lightning": "🌩",
	"zap": "⚡",
	"fire": "🔥",
	"boom": "💥",
	"snowflake": "❄️",
	"cloud_with_snow": "🌨",
	"snowman": "⛄",
	"snowman_with_snow": "☃",
	"wind_face": "🌬",
	"dash": "💨",
	"tornado": "🌪",
	"fog": "🌫",
	"open_umbrella": "☂",
	"umbrella": "☔",
	"droplet": "💧",
	"sweat_drops": "💦",
	"ocean": "🌊",
	"green_apple": "🍏",
	"apple": "🍎",
	"pear": "🍐",
	"tangerine": "🍊",
	"lemon": "🍋",
	"banana": "🍌",
	"watermelon": "🍉",
	"grapes": "🍇",
	"strawberry": "🍓",
	"melon": "🍈",
	"cherries": "🍒",
	"peach": "🍑",
	"pineapple": "🍍",
	"kiwi_fruit": "🥝",
	"avocado": "🥑",
	"tomato": "🍅",
	"eggplant": "🍆",
	"cucumber": "🥒",
	"carrot": "🥕",
	"hot_pepper": "🌶",
	"potato": "🥔",
	"corn": "🌽",
	"sweet_potato": "🍠",
	"peanuts": "🥜",
	"honey_pot": "🍯",
	"croissant": "🥐",
	"bread": "🍞",
	"baguette_bread": "🥖",
	"cheese": "🧀",
	"egg": "🥚",
	"bacon": "🥓",
	"pancakes": "🥞",
	"poultry_leg": "🍗",
	"meat_on_bone": "🍖",
	"fried_shrimp": "🍤",
	"fried_egg": "🍳",
	"hamburger": "🍔",
	"fries": "🍟",
	"stuffed_flatbread": "🥙",
	"hotdog": "🌭",
	"pizza": "🍕",
	"spaghetti": "🍝",
	"taco": "🌮",
	"burrito": "🌯",
	"green_salad": "🥗",
	"shallow_pan_of_food": "🥘",
	"ramen": "🍜",
	"stew": "🍲",
	"fish_cake": "🍥",
	"sushi": "🍣",
	"bento": "🍱",
	"curry": "🍛",
	"rice_ball": "🍙",
	"rice": "🍚",
	"rice_cracker": "🍘",
	"oden": "🍢",
	"dango": "🍡",
	"shaved_ice": "🍧",
	"ice_cream": "🍨",
	"icecream": "🍦",
	"cake": "🍰",
	"birthday": "🎂",
	"custard": "🍮",
	"candy": "🍬",
	"lollipop": "🍭",
	"chocolate_bar": "🍫",
	"popcorn": "🍿",
	"doughnut": "🍩",
	"cookie": "🍪",
	"milk_glass": "🥛",
	"beer": "🍺",
	"beers": "🍻",
	"clinking_glasses": "🥂",
	"wine_glass": "🍷",
	"tumbler_glass": "🥃",
	"cocktail": "🍸",
	"tropical_drink": "🍹",
	"champagne": "🍾",
	"sake": "🍶",
	"tea": "🍵",
	"coffee": "☕",
	"baby_bottle": "🍼",
	"spoon": "🥄",
	"fork_and_knife": "🍴",
	"plate_with_cutlery": "🍽",
	"soccer": "⚽",
	"basketball": "🏀",
	"football": "🏈",
	"baseball": "⚾",
	"tennis": "🎾",
	"volleyball": "🏐",
	"rugby_football": "🏉",
	"8ball": "🎱",
	"golf": "⛳",
	"golfing_woman": "🏌️‍",
	"golfing_man": "🏌",
	"ping_pong": "🏓",
	"badminton": "🏸",
	"goal_net": "🥅",
	"ice_hockey": "🏒",
	"field_hockey": "🏑",
	"cricket": "🏏",
	"ski": "🎿",
	"skier": "⛷",
	"snowboarder": "🏂",
	"person_fencing": "🤺",
	"women_wrestling": "🤼‍",
	"men_wrestling": "🤼‍",
	"woman_cartwheeling": "🤸‍",
	"man_cartwheeling": "🤸‍",
	"woman_playing_handball": "🤾‍",
	"man_playing_handball": "🤾‍",
	"ice_skate": "⛸",
	"bow_and_arrow": "🏹",
	"fishing_pole_and_fish": "🎣",
	"boxing_glove": "🥊",
	"martial_arts_uniform": "🥋",
	"rowing_woman": "🚣‍",
	"rowing_man": "🚣",
	"swimming_woman": "🏊‍",
	"swimming_man": "🏊",
	"woman_playing_water_polo": "🤽‍",
	"man_playing_water_polo": "🤽‍",
	"surfing_woman": "🏄‍",
	"surfing_man": "🏄",
	"bath": "🛀",
	"basketball_woman": "⛹️‍",
	"basketball_man": "⛹",
	"weight_lifting_woman": "🏋️‍",
	"weight_lifting_man": "🏋",
	"biking_woman": "🚴‍",
	"biking_man": "🚴",
	"mountain_biking_woman": "🚵‍",
	"mountain_biking_man": "🚵",
	"horse_racing": "🏇",
	"business_suit_levitating": "🕴",
	"trophy": "🏆",
	"running_shirt_with_sash": "🎽",
	"medal_sports": "🏅",
	"medal_military": "🎖",
	"1st_place_medal": "🥇",
	"2nd_place_medal": "🥈",
	"3rd_place_medal": "🥉",
	"reminder_ribbon": "🎗",
	"rosette": "🏵",
	"ticket": "🎫",
	"tickets": "🎟",
	"performing_arts": "🎭",
	"art": "🎨",
	"circus_tent": "🎪",
	"woman_juggling": "🤹‍",
	"man_juggling": "🤹‍",
	"microphone": "🎤",
	"headphones": "🎧",
	"musical_score": "🎼",
	"musical_keyboard": "🎹",
	"drum": "🥁",
	"saxophone": "🎷",
	"trumpet": "🎺",
	"guitar": "🎸",
	"violin": "🎻",
	"clapper": "🎬",
	"video_game": "🎮",
	"space_invader": "👾",
	"dart": "🎯",
	"game_die": "🎲",
	"slot_machine": "🎰",
	"bowling": "🎳",
	"red_car": "🚗",
	"taxi": "🚕",
	"blue_car": "🚙",
	"bus": "🚌",
	"trolleybus": "🚎",
	"racing_car": "🏎",
	"police_car": "🚓",
	"ambulance": "🚑",
	"fire_engine": "🚒",
	"minibus": "🚐",
	"truck": "🚚",
	"articulated_lorry": "🚛",
	"tractor": "🚜",
	"kick_scooter": "🛴",
	"motorcycle": "🏍",
	"bike": "🚲",
	"motor_scooter": "🛵",
	"rotating_light": "🚨",
	"oncoming_police_car": "🚔",
	"oncoming_bus": "🚍",
	"oncoming_automobile": "🚘",
	"oncoming_taxi": "🚖",
	"aerial_tramway": "🚡",
	"mountain_cableway": "🚠",
	"suspension_railway": "🚟",
	"railway_car": "🚃",
	"train": "🚋",
	"monorail": "🚝",
	"bullettrain_side": "🚄",
	"bullettrain_front": "🚅",
	"light_rail": "🚈",
	"mountain_railway": "🚞",
	"steam_locomotive": "🚂",
	"train2": "🚆",
	"metro": "🚇",
	"tram": "🚊",
	"station": "🚉",
	"helicopter": "🚁",
	"small_airplane": "🛩",
	"airplane": "✈️",
	"flight_departure": "🛫",
	"flight_arrival": "🛬",
	"sailboat": "⛵",
	"motor_boat": "🛥",
	"speedboat": "🚤",
	"ferry": "⛴",
	"passenger_ship": "🛳",
	"rocket": "🚀",
	"artificial_satellite": "🛰",
	"seat": "💺",
	"canoe": "🛶",
	"anchor": "⚓",
	"construction": "🚧",
	"fuelpump": "⛽",
	"busstop": "🚏",
	"vertical_traffic_light": "🚦",
	"traffic_light": "🚥",
	"checkered_flag": "🏁",
	"ship": "🚢",
	"ferris_wheel": "🎡",
	"roller_coaster": "🎢",
	"carousel_horse": "🎠",
	"building_construction": "🏗",
	"foggy": "🌁",
	"tokyo_tower": "🗼",
	"factory": "🏭",
	"fountain": "⛲",
	"rice_scene": "🎑",
	"mountain": "⛰",
	"mountain_snow": "🏔",
	"mount_fuji": "🗻",
	"volcano": "🌋",
	"japan": "🗾",
	"camping": "🏕",
	"tent": "⛺",
	"national_park": "🏞",
	"motorway": "🛣",
	"railway_track": "🛤",
	"sunrise": "🌅",
	"sunrise_over_mountains": "🌄",
	"desert": "🏜",
	"beach_umbrella": "🏖",
	"desert_island": "🏝",
	"city_sunrise": "🌇",
	"city_sunset": "🌆",
	"cityscape": "🏙",
	"night_with_stars": "🌃",
	"bridge_at_night": "🌉",
	"milky_way": "🌌",
	"stars": "🌠",
	"sparkler": "🎇",
	"fireworks": "🎆",
	"rainbow": "🌈",
	"houses": "🏘",
	"european_castle": "🏰",
	"japanese_castle": "🏯",
	"stadium": "🏟",
	"statue_of_liberty": "🗽",
	"house": "🏠",
	"house_with_garden": "🏡",
	"derelict_house": "🏚",
	"office": "🏢",
	"department_store": "🏬",
	"post_office": "🏣",
	"european_post_office": "🏤",
	"hospital": "🏥",
	"bank": "🏦",
	"hotel": "🏨",
	"convenience_store": "🏪",
	"school": "🏫",
	"love_hotel": "🏩",
	"wedding": "💒",
	"classical_building": "🏛",
	"church": "⛪",
	"mosque": "🕌",
	"synagogue": "🕍",
	"kaaba": "🕋",
	"shinto_shrine": "⛩",
	"watch": "⌚",
	"iphone": "📱",
	"calling": "📲",
	"computer": "💻",
	"keyboard": "⌨",
	"desktop_computer": "🖥",
	"printer": "🖨",
	"computer_mouse": "🖱",
	"trackball": "🖲",
	"joystick": "🕹",
	"clamp": "🗜",
	"minidisc": "💽",
	"floppy_disk": "💾",
	"cd": "💿",
	"dvd": "📀",
	"vhs": "📼",
	"camera": "📷",
	"camera_flash": "📸",
	"video_camera": "📹",
	"movie_camera": "🎥",
	"film_projector": "📽",
	"film_strip": "🎞",
	"telephone_receiver": "📞",
	"phone": "☎️",
	"pager": "📟",
	"fax": "📠",
	"tv": "📺",
	"radio": "📻",
	"studio_microphone": "🎙",
	"level_slider": "🎚",
	"control_knobs": "🎛",
	"stopwatch": "⏱",
	"timer_clock": "⏲",
	"alarm_clock": "⏰",
	"mantelpiece_clock": "🕰",
	"hourglass_flowing_sand": "⏳",
	"hourglass": "⌛",
	"satellite": "📡",
	"battery": "🔋",
	"electric_plug": "🔌",
	"bulb": "💡",
	"flashlight": "🔦",
	"candle": "🕯",
	"wastebasket": "🗑",
	"oil_drum": "🛢",
	"money_with_wings": "💸",
	"dollar": "💵",
	"yen": "💴",
	"euro": "💶",
	"pound": "💷",
	"moneybag": "💰",
	"credit_card": "💳",
	"gem": "💎",
	"balance_scale": "⚖",
	"wrench": "🔧",
	"hammer": "🔨",
	"hammer_and_pick": "⚒",
	"hammer_and_wrench": "🛠",
	"pick": "⛏",
	"nut_and_bolt": "🔩",
	"gear": "⚙",
	"chains": "⛓",
	"gun": "🔫",
	"bomb": "💣",
	"hocho": "🔪",
	"dagger": "🗡",
	"crossed_swords": "⚔",
	"shield": "🛡",
	"smoking": "🚬",
	"skull_and_crossbones": "☠",
	"coffin": "⚰",
	"funeral_urn": "⚱",
	"amphora": "🏺",
	"crystal_ball": "🔮",
	"prayer_beads": "📿",
	"barber": "💈",
	"alembic": "⚗",
	"telescope": "🔭",
	"microscope": "🔬",
	"hole": "🕳",
	"pill": "💊",
	"syringe": "💉",
	"thermometer": "🌡",
	"label": "🏷",
	"bookmark": "🔖",
	"toilet": "🚽",
	"shower": "🚿",
	"bathtub": "🛁",
	"key": "🔑",
	"old_key": "🗝",
	"couch_and_lamp": "🛋",
	"sleeping_bed": "🛌",
	"bed": "🛏",
	"door": "🚪",
	"bellhop_bell": "🛎",
	"framed_picture": "🖼",
	"world_map": "🗺",
	"parasol_on_ground": "⛱",
	"moyai": "🗿",
	"shopping": "🛍",
	"shopping_cart": "🛒",
	"balloon": "🎈",
	"flags": "🎏",
	"ribbon": "🎀",
	"gift": "🎁",
	"confetti_ball": "🎊",
	"tada": "🎉",
	"dolls": "🎎",
	"wind_chime": "🎐",
	"crossed_flags": "🎌",
	"izakaya_lantern": "🏮",
	"email": "✉️",
	"envelope_with_arrow": "📩",
	"incoming_envelope": "📨",
	"e_mail": "📧",
	"love_letter": "💌",
	"postbox": "📮",
	"mailbox_closed": "📪",
	"mailbox": "📫",
	"mailbox_with_mail": "📬",
	"mailbox_with_no_mail": "📭",
	"package": "📦",
	"postal_horn": "📯",
	"inbox_tray": "📥",
	"outbox_tray": "📤",
	"scroll": "📜",
	"page_with_curl": "📃",
	"bookmark_tabs": "📑",
	"bar_chart": "📊",
	"chart_with_upwards_trend": "📈",
	"chart_with_downwards_trend": "📉",
	"page_facing_up": "📄",
	"date": "📅",
	"calendar": "📆",
	"spiral_calendar": "🗓",
	"card_index": "📇",
	"card_file_box": "🗃",
	"ballot_box": "🗳",
	"file_cabinet": "🗄",
	"clipboard": "📋",
	"spiral_notepad": "🗒",
	"file_folder": "📁",
	"open_file_folder": "📂",
	"card_index_dividers": "🗂",
	"newspaper_roll": "🗞",
	"newspaper": "📰",
	"notebook": "📓",
	"closed_book": "📕",
	"green_book": "📗",
	"blue_book": "📘",
	"orange_book": "📙",
	"notebook_with_decorative_cover": "📔",
	"ledger": "📒",
	"books": "📚",
	"open_book": "📖",
	"link": "🔗",
	"paperclip": "📎",
	"paperclips": "🖇",
	"scissors": "✂️",
	"triangular_ruler": "📐",
	"straight_ruler": "📏",
	"pushpin": "📌",
	"round_pushpin": "📍",
	"triangular_flag_on_post": "🚩",
	"white_flag": "🏳",
	"black_flag": "🏴",
	"rainbow_flag": "🏳️‍🌈",
	"closed_lock_with_key": "🔐",
	"lock": "🔒",
	"unlock": "🔓",
	"lock_with_ink_pen": "🔏",
	"pen": "🖊",
	"fountain_pen": "🖋",
	"black_nib": "✒️",
	"memo": "📝",
	"pencil2": "✏️",
	"crayon": "🖍",
	"paintbrush": "🖌",
	"mag": "🔍",
	"mag_right": "🔎",
	"heart": "❤️",
	"yellow_heart": "💛",
	"green_heart": "💚",
	"blue_heart": "💙",
	"purple_heart": "💜",
	"black_heart": "🖤",
	"broken_heart": "💔",
	"heavy_heart_exclamation": "❣",
	"two_hearts": "💕",
	"revolving_hearts": "💞",
	"heartbeat": "💓",
	"heartpulse": "💗",
	"sparkling_heart": "💖",
	"cupid": "💘",
	"gift_heart": "💝",
	"heart_decoration": "💟",
	"peace_symbol": "☮",
	"latin_cross": "✝",
	"star_and_crescent": "☪",
	"om": "🕉",
	"wheel_of_dharma": "☸",
	"star_of_david": "✡",
	"six_pointed_star": "🔯",
	"menorah": "🕎",
	"yin_yang": "☯",
	"orthodox_cross": "☦",
	"place_of_worship": "🛐",
	"ophiuchus": "⛎",
	"aries": "♈",
	"taurus": "♉",
	"gemini": "♊",
	"cancer": "♋",
	"leo": "♌",
	"virgo": "♍",
	"libra": "♎",
	"scorpius": "♏",
	"sagittarius": "♐",
	"capricorn": "♑",
	"aquarius": "♒",
	"pisces": "♓",
	"id": "🆔",
	"atom_symbol": "⚛",
	"u7a7a": "🈳",
	"u5272": "🈹",
	"radioactive": "☢",
	"biohazard": "☣",
	"mobile_phone_off": "📴",
	"vibration_mode": "📳",
	"u6709": "🈶",
	"u7121": "🈚",
	"u7533": "🈸",
	"u55b6": "🈺",
	"u6708": "🈷️",
	"eight_pointed_black_star": "✴️",
	"vs": "🆚",
	"accept": "🉑",
	"white_flower": "💮",
	"ideograph_advantage": "🉐",
	"secret": "㊙️",
	"congratulations": "㊗️",
	"u5408": "🈴",
	"u6e80": "🈵",
	"u7981": "🈲",
	"a": "🅰️",
	"b": "🅱️",
	"ab": "🆎",
	"cl": "🆑",
	"o2": "🅾️",
	"sos": "🆘",
	"no_entry": "⛔",
	"name_badge": "📛",
	"no_entry_sign": "🚫",
	"x": "❌",
	"o": "⭕",
	"stop_sign": "🛑",
	"anger": "💢",
	"hotsprings": "♨️",
	"no_pedestrians": "🚷",
	"do_not_litter": "🚯",
	"no_bicycles": "🚳",
	"non_potable_water": "🚱",
	"underage": "🔞",
	"no_mobile_phones": "📵",
	"exclamation": "❗",
	"grey_exclamation": "❕",
	"question": "❓",
	"grey_question": "❔",
	"bangbang": "‼️",
	"interrobang": "⁉️",
	"low_brightness": "🔅",
	"high_brightness": "🔆",
	"trident": "🔱",
	"fleur_de_lis": "⚜",
	"part_alternation_mark": "〽️",
	"warning": "⚠️",
	"children_crossing": "🚸",
	"beginner": "🔰",
	"recycle": "♻️",
	"u6307": "🈯",
	"chart": "💹",
	"sparkle": "❇️",
	"eight_spoked_asterisk": "✳️",
	"negative_squared_cross_mark": "❎",
	"white_check_mark": "✅",
	"diamond_shape_with_a_dot_inside": "💠",
	"cyclone": "🌀",
	"loop": "➿",
	"globe_with_meridians": "🌐",
	"m": "Ⓜ️",
	"atm": "🏧",
	"sa": "🈂️",
	"passport_control": "🛂",
	"customs": "🛃",
	"baggage_claim": "🛄",
	"left_luggage": "🛅",
	"wheelchair": "♿",
	"no_smoking": "🚭",
	"wc": "🚾",
	"parking": "🅿️",
	"potable_water": "🚰",
	"mens": "🚹",
	"womens": "🚺",
	"baby_symbol": "🚼",
	"restroom": "🚻",
	"put_litter_in_its_place": "🚮",
	"cinema": "🎦",
	"signal_strength": "📶",
	"koko": "🈁",
	"ng": "🆖",
	"ok": "🆗",
	"up": "🆙",
	"cool": "🆒",
	"new": "🆕",
	"free": "🆓",
	"zero": "0️⃣",
	"one": "1️⃣",
	"two": "2️⃣",
	"three": "3️⃣",
	"four": "4️⃣",
	"five": "5️⃣",
	"six": "6️⃣",
	"seven": "7️⃣",
	"eight": "8️⃣",
	"nine": "9️⃣",
	"keycap_ten": "🔟",
	"asterisk": "*⃣",
	"arrow_forward": "▶️",
	"pause_button": "⏸",
	"next_track_button": "⏭",
	"stop_button": "⏹",
	"record_button": "⏺",
	"play_or_pause_button": "⏯",
	"previous_track_button": "⏮",
	"fast_forward": "⏩",
	"rewind": "⏪",
	"twisted_rightwards_arrows": "🔀",
	"repeat": "🔁",
	"repeat_one": "🔂",
	"arrow_backward": "◀️",
	"arrow_up_small": "🔼",
	"arrow_down_small": "🔽",
	"arrow_double_up": "⏫",
	"arrow_double_down": "⏬",
	"arrow_right": "➡️",
	"arrow_left": "⬅️",
	"arrow_up": "⬆️",
	"arrow_down": "⬇️",
	"arrow_upper_right": "↗️",
	"arrow_lower_right": "↘️",
	"arrow_lower_left": "↙️",
	"arrow_upper_left": "↖️",
	"arrow_up_down": "↕️",
	"left_right_arrow": "↔️",
	"arrows_counterclockwise": "🔄",
	"arrow_right_hook": "↪️",
	"leftwards_arrow_with_hook": "↩️",
	"arrow_heading_up": "⤴️",
	"arrow_heading_down": "⤵️",
	"hash": "#️⃣",
	"information_source": "ℹ️",
	"abc": "🔤",
	"abcd": "🔡",
	"capital_abcd": "🔠",
	"symbols": "🔣",
	"musical_note": "🎵",
	"notes": "🎶",
	"wavy_dash": "〰️",
	"curly_loop": "➰",
	"heavy_check_mark": "✔️",
	"arrows_clockwise": "🔃",
	"heavy_plus_sign": "➕",
	"heavy_minus_sign": "➖",
	"heavy_division_sign": "➗",
	"heavy_multiplication_x": "✖️",
	"heavy_dollar_sign": "💲",
	"currency_exchange": "💱",
	"copyright": "©️",
	"registered": "®️",
	"tm": "™️",
	"end": "🔚",
	"back": "🔙",
	"on": "🔛",
	"top": "🔝",
	"soon": "🔜",
	"ballot_box_with_check": "☑️",
	"radio_button": "🔘",
	"white_circle": "⚪",
	"black_circle": "⚫",
	"red_circle": "🔴",
	"large_blue_circle": "🔵",
	"small_orange_diamond": "🔸",
	"small_blue_diamond": "🔹",
	"large_orange_diamond": "🔶",
	"large_blue_diamond": "🔷",
	"small_red_triangle": "🔺",
	"black_small_square": "▪️",
	"white_small_square": "▫️",
	"black_large_square": "⬛",
	"white_large_square": "⬜",
	"small_red_triangle_down": "🔻",
	"black_medium_square": "◼️",
	"white_medium_square": "◻️",
	"black_medium_small_square": "◾",
	"white_medium_small_square": "◽",
	"black_square_button": "🔲",
	"white_square_button": "🔳",
	"speaker": "🔈",
	"sound": "🔉",
	"loud_sound": "🔊",
	"mute": "🔇",
	"mega": "📣",
	"loudspeaker": "📢",
	"bell": "🔔",
	"no_bell": "🔕",
	"black_joker": "🃏",
	"mahjong": "🀄",
	"spades": "♠️",
	"clubs": "♣️",
	"hearts": "♥️",
	"diamonds": "♦️",
	"flower_playing_cards": "🎴",
	"thought_balloon": "💭",
	"right_anger_bubble": "🗯",
	"speech_balloon": "💬",
	"left_speech_bubble": "🗨",
	"clock1": "🕐",
	"clock2": "🕑",
	"clock3": "🕒",
	"clock4": "🕓",
	"clock5": "🕔",
	"clock6": "🕕",
	"clock7": "🕖",
	"clock8": "🕗",
	"clock9": "🕘",
	"clock10": "🕙",
	"clock11": "🕚",
	"clock12": "🕛",
	"clock130": "🕜",
	"clock230": "🕝",
	"clock330": "🕞",
	"clock430": "🕟",
	"clock530": "🕠",
	"clock630": "🕡",
	"clock730": "🕢",
	"clock830": "🕣",
	"clock930": "🕤",
	"clock1030": "🕥",
	"clock1130": "🕦",
	"clock1230": "🕧",
	"afghanistan": "🇦🇫",
	"aland_islands": "🇦🇽",
	"albania": "🇦🇱",
	"algeria": "🇩🇿",
	"american_samoa": "🇦🇸",
	"andorra": "🇦🇩",
	"angola": "🇦🇴",
	"anguilla": "🇦🇮",
	"antarctica": "🇦🇶",
	"antigua_barbuda": "🇦🇬",
	"argentina": "🇦🇷",
	"armenia": "🇦🇲",
	"aruba": "🇦🇼",
	"australia": "🇦🇺",
	"austria": "🇦🇹",
	"azerbaijan": "🇦🇿",
	"bahamas": "🇧🇸",
	"bahrain": "🇧🇭",
	"bangladesh": "🇧🇩",
	"barbados": "🇧🇧",
	"belarus": "🇧🇾",
	"belgium": "🇧🇪",
	"belize": "🇧🇿",
	"benin": "🇧🇯",
	"bermuda": "🇧🇲",
	"bhutan": "🇧🇹",
	"bolivia": "🇧🇴",
	"caribbean_netherlands": "🇧🇶",
	"bosnia_herzegovina": "🇧🇦",
	"botswana": "🇧🇼",
	"brazil": "🇧🇷",
	"british_indian_ocean_territory": "🇮🇴",
	"british_virgin_islands": "🇻🇬",
	"brunei": "🇧🇳",
	"bulgaria": "🇧🇬",
	"burkina_faso": "🇧🇫",
	"burundi": "🇧🇮",
	"cape_verde": "🇨🇻",
	"cambodia": "🇰🇭",
	"cameroon": "🇨🇲",
	"canada": "🇨🇦",
	"canary_islands": "🇮🇨",
	"cayman_islands": "🇰🇾",
	"central_african_republic": "🇨🇫",
	"chad": "🇹🇩",
	"chile": "🇨🇱",
	"cn": "🇨🇳",
	"christmas_island": "🇨🇽",
	"cocos_islands": "🇨🇨",
	"colombia": "🇨🇴",
	"comoros": "🇰🇲",
	"congo_brazzaville": "🇨🇬",
	"congo_kinshasa": "🇨🇩",
	"cook_islands": "🇨🇰",
	"costa_rica": "🇨🇷",
	"croatia": "🇭🇷",
	"cuba": "🇨🇺",
	"curacao": "🇨🇼",
	"cyprus": "🇨🇾",
	"czech_republic": "🇨🇿",
	"denmark": "🇩🇰",
	"djibouti": "🇩🇯",
	"dominica": "🇩🇲",
	"dominican_republic": "🇩🇴",
	"ecuador": "🇪🇨",
	"egypt": "🇪🇬",
	"el_salvador": "🇸🇻",
	"equatorial_guinea": "🇬🇶",
	"eritrea": "🇪🇷",
	"estonia": "🇪🇪",
	"ethiopia": "🇪🇹",
	"eu": "🇪🇺",
	"falkland_islands": "🇫🇰",
	"faroe_islands": "🇫🇴",
	"fiji": "🇫🇯",
	"finland": "🇫🇮",
	"fr": "🇫🇷",
	"french_guiana": "🇬🇫",
	"french_polynesia": "🇵🇫",
	"french_southern_territories": "🇹🇫",
	"gabon": "🇬🇦",
	"gambia": "🇬🇲",
	"georgia": "🇬🇪",
	"de": "🇩🇪",
	"ghana": "🇬🇭",
	"gibraltar": "🇬🇮",
	"greece": "🇬🇷",
	"greenland": "🇬🇱",
	"grenada": "🇬🇩",
	"guadeloupe": "🇬🇵",
	"guam": "🇬🇺",
	"guatemala": "🇬🇹",
	"guernsey": "🇬🇬",
	"guinea": "🇬🇳",
	"guinea_bissau": "🇬🇼",
	"guyana": "🇬🇾",
	"haiti": "🇭🇹",
	"honduras": "🇭🇳",
	"hong_kong": "🇭🇰",
	"hungary": "🇭🇺",
	"iceland": "🇮🇸",
	"india": "🇮🇳",
	"indonesia": "🇮🇩",
	"iran": "🇮🇷",
	"iraq": "🇮🇶",
	"ireland": "🇮🇪",
	"isle_of_man": "🇮🇲",
	"israel": "🇮🇱",
	"it": "🇮🇹",
	"cote_divoire": "🇨🇮",
	"jamaica": "🇯🇲",
	"jp": "🇯🇵",
	"jersey": "🇯🇪",
	"jordan": "🇯🇴",
	"kazakhstan": "🇰🇿",
	"kenya": "🇰🇪",
	"kiribati": "🇰🇮",
	"kosovo": "🇽🇰",
	"kuwait": "🇰🇼",
	"kyrgyzstan": "🇰🇬",
	"laos": "🇱🇦",
	"latvia": "🇱🇻",
	"lebanon": "🇱🇧",
	"lesotho": "🇱🇸",
	"liberia": "🇱🇷",
	"libya": "🇱🇾",
	"liechtenstein": "🇱🇮",
	"lithuania": "🇱🇹",
	"luxembourg": "🇱🇺",
	"macau": "🇲🇴",
	"macedonia": "🇲🇰",
	"madagascar": "🇲🇬",
	"malawi": "🇲🇼",
	"malaysia": "🇲🇾",
	"maldives": "🇲🇻",
	"mali": "🇲🇱",
	"malta": "🇲🇹",
	"marshall_islands": "🇲🇭",
	"martinique": "🇲🇶",
	"mauritania": "🇲🇷",
	"mauritius": "🇲🇺",
	"mayotte": "🇾🇹",
	"mexico": "🇲🇽",
	"micronesia": "🇫🇲",
	"moldova": "🇲🇩",
	"monaco": "🇲🇨",
	"mongolia": "🇲🇳",
	"montenegro": "🇲🇪",
	"montserrat": "🇲🇸",
	"morocco": "🇲🇦",
	"mozambique": "🇲🇿",
	"myanmar": "🇲🇲",
	"namibia": "🇳🇦",
	"nauru": "🇳🇷",
	"nepal": "🇳🇵",
	"netherlands": "🇳🇱",
	"new_caledonia": "🇳🇨",
	"new_zealand": "🇳🇿",
	"nicaragua": "🇳🇮",
	"niger": "🇳🇪",
	"nigeria": "🇳🇬",
	"niue": "🇳🇺",
	"norfolk_island": "🇳🇫",
	"northern_mariana_islands": "🇲🇵",
	"north_korea": "🇰🇵",
	"norway": "🇳🇴",
	"oman": "🇴🇲",
	"pakistan": "🇵🇰",
	"palau": "🇵🇼",
	"palestinian_territories": "🇵🇸",
	"panama": "🇵🇦",
	"papua_new_guinea": "🇵🇬",
	"paraguay": "🇵🇾",
	"peru": "🇵🇪",
	"philippines": "🇵🇭",
	"pitcairn_islands": "🇵🇳",
	"poland": "🇵🇱",
	"portugal": "🇵🇹",
	"puerto_rico": "🇵🇷",
	"qatar": "🇶🇦",
	"reunion": "🇷🇪",
	"romania": "🇷🇴",
	"ru": "🇷🇺",
	"rwanda": "🇷🇼",
	"st_barthelemy": "🇧🇱",
	"st_helena": "🇸🇭",
	"st_kitts_nevis": "🇰🇳",
	"st_lucia": "🇱🇨",
	"st_pierre_miquelon": "🇵🇲",
	"st_vincent_grenadines": "🇻🇨",
	"samoa": "🇼🇸",
	"san_marino": "🇸🇲",
	"sao_tome_principe": "🇸🇹",
	"saudi_arabia": "🇸🇦",
	"senegal": "🇸🇳",
	"serbia": "🇷🇸",
	"seychelles": "🇸🇨",
	"sierra_leone": "🇸🇱",
	"singapore": "🇸🇬",
	"sint_maarten": "🇸🇽",
	"slovakia": "🇸🇰",
	"slovenia": "🇸🇮",
	"solomon_islands": "🇸🇧",
	"somalia": "🇸🇴",
	"south_africa": "🇿🇦",
	"south_georgia_south_sandwich_islands": "🇬🇸",
	"kr": "🇰🇷",
	"south_sudan": "🇸🇸",
	"es": "🇪🇸",
	"sri_lanka": "🇱🇰",
	"sudan": "🇸🇩",
	"suriname": "🇸🇷",
	"swaziland": "🇸🇿",
	"sweden": "🇸🇪",
	"switzerland": "🇨🇭",
	"syria": "🇸🇾",
	"taiwan": "🇹🇼",
	"tajikistan": "🇹🇯",
	"tanzania": "🇹🇿",
	"thailand": "🇹🇭",
	"timor_leste": "🇹🇱",
	"togo": "🇹🇬",
	"tokelau": "🇹🇰",
	"tonga": "🇹🇴",
	"trinidad_tobago": "🇹🇹",
	"tunisia": "🇹🇳",
	"tr": "🇹🇷",
	"turkmenistan": "🇹🇲",
	"turks_caicos_islands": "🇹🇨",
	"tuvalu": "🇹🇻",
	"uganda": "🇺🇬",
	"ukraine": "🇺🇦",
	"united_arab_emirates": "🇦🇪",
	"uk": "🇬🇧",
	"us": "🇺🇸",
	"us_virgin_islands": "🇻🇮",
	"uruguay": "🇺🇾",
	"uzbekistan": "🇺🇿",
	"vanuatu": "🇻🇺",
	"vatican_city": "🇻🇦",
	"venezuela": "🇻🇪",
	"vietnam": "🇻🇳",
	"wallis_futuna": "🇼🇫",
	"western_sahara": "🇪🇭",
	"yemen": "🇾🇪",
	"zambia": "🇿🇲",
	"zimbabwe": "🇿🇼"
}

},{}]},{},[4]);
