"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

require('axios');

(function (factory) {
  if ((typeof module === "undefined" ? "undefined" : (0, _typeof2.default)(module)) === "object" && (0, _typeof2.default)(module.exports) === "object") {
    var v = factory(require, exports);
    if (v !== undefined) module.exports = v;
  } else if (typeof define === "function" && define.amd) {
    define(["require", "exports", "lodash"], factory);
  }
})(function (require, exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var lodash_1 = require("lodash");

  function axios(ax, def) {
    if (!ax) {
      return false;
    }

    if ((0, _typeof2.default)(def) == "object") {
      for (var k in def) {
        ax.defaults[k] = def[k];
      }
    }

    ax.use = function (type, def) {
      var instance = ax;

      if (type == "FormData") {
        instance = ax.create(Object.assign(def, {
          transformRequest: [function (data) {
            var ret = [];

            for (var it in data) {
              ret.push(encodeURIComponent(it) + '=' + encodeURIComponent(data[it]));
            }

            return ret.join("&");
          }],
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }));
      }

      return instance;
    };
  }

  exports.axios = axios;

  function _debounce() {
    lodash_1.debounce(function () {}, 200);
  }

  exports._debounce = _debounce;
});