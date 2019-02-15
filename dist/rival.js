"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _axios;

_axios = function _axios(ax, def) {
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
};

new Promise(function (resolve, reject) {});
module.exports = {
  axios: _axios
};