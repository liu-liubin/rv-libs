import sinaif from "./sinaif/v01";
import Axios from "axios";
export function axios(def) {
    var ax = Axios;
    if (typeof def == "object") {
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
                },
            }));
        }
        for (var k in def) {
            instance.defaults[k] = def[k];
        }
        return instance;
    };
}
export var SINAIF = sinaif;
