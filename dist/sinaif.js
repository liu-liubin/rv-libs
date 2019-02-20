"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var win = window;
var UPDATA;
var Sinaif = (function () {
    function Sinaif() {
        this.callBackAction = [];
        this._updataInfo = {
            sourceEventParams: {}
        };
        this.updataConfig = {
            qsjParams: {
                sourceEventParams: {},
            },
            qjsCallback: function () { }
        };
        this.debug = parseInt(window.location.port) >= 8860 && parseInt(window.location.port) <= 8880;
        this.loadingClose();
    }
    Sinaif.prototype.alertCustomWebInfoDiaLog = function (data, action) {
        if (typeof data != "object") {
            data = {};
        }
        this.callApp("alertCustomWebInfoDialog", data);
        if (this.debug && action instanceof Function) {
            action();
        }
    };
    Sinaif.prototype.callApp = function (url, data) {
        url = "hsinaif://" + encodeURIComponent(url);
        if (typeof data != "object") {
            data = {};
        }
        else {
            var qsArr = [];
            for (var key in data) {
                if (data.hasOwnProperty(key)) {
                    qsArr.push(key + "=" + encodeURIComponent(data[key]));
                }
            }
            url += "?" + qsArr.join("&");
        }
        console.log(url);
        win.location.jumpurl = win.decodeURIComponent(url);
        var iframe = document.createElement("iframe");
        iframe.style.width = "1px";
        iframe.style.height = "1px";
        iframe.style.display = "none";
        iframe.src = url;
        document.body.appendChild(iframe);
        setTimeout(function () {
            iframe.remove();
        }, 100);
    };
    Sinaif.prototype.closeItem = function () {
        this.callApp("closeItem");
        if (this.debug) {
        }
    };
    Sinaif.prototype.closeBackItem = function () {
        this.callApp("closeBackItem");
    };
    Sinaif.prototype.getHomeData = function (obj, fun) {
        var callbackname = this.registAction(fun);
        this.callApp("getHomeData", { callbackname: callbackname, needRefresh: "Yes" });
    };
    Sinaif.prototype.loadingClose = function () {
        this.callApp("loadingClose");
    };
    Sinaif.prototype.loadingShow = function () {
        this.callApp("loadingShow");
    };
    Sinaif.prototype.loadingDialogShow = function () {
        this.callApp("loadingDialogShow");
    };
    Sinaif.prototype.loadingDialogClose = function () {
        this.callApp("loadingDialogClose");
    };
    Sinaif.prototype.mobileSetting = function () {
        this.callApp("mobileSetting");
    };
    Sinaif.prototype.openWin = function (data, action) {
        if (data instanceof Object == false) {
            data = {};
        }
        if (!data.title) {
            console.error("请传入参数title");
        }
        if (!data.url) {
            console.error("请传入参数url");
        }
        this.callApp("openWin", data);
        if (this.debug && action instanceof Function) {
            action();
        }
    };
    Sinaif.prototype.openBackWin = function (data) {
        if (data instanceof Object == false) {
            data = {};
        }
        if (!data.title) {
            console.error("请传入参数title");
        }
        this.callApp("openBackWin", data);
    };
    Sinaif.prototype.popstate = function (fun) {
        window.history.pushState("sinaif.popstate", "", document.referrer || window.location.href);
        window.addEventListener("popstate", function (event) {
            if (event.state != "sinaif.popstate") {
                if (fun instanceof Function) {
                    fun(window.history);
                }
                else {
                    window.history.go(-1);
                }
            }
        });
    };
    Sinaif.prototype.queryStatus = function (data) {
        if (data === void 0) { data = true; }
        var o = { isHomePage: "false" };
        if (data === true) {
            o.isHomePage = "true";
        }
        if (Object.prototype.toString.call(data) == "[object Object]") {
            o = data;
        }
        this.callApp("queryStatus", o);
    };
    Sinaif.prototype.registAction = function (action) {
        if (action instanceof Function == false) {
            return "";
        }
        else {
        }
        var actionName = "callBackAction" + this.callBackAction.length;
        this.callBackAction.push({ name: actionName });
        Object.defineProperty(this, actionName, {
            value: action
        });
        if (win[actionName]) {
        }
        else {
            win[actionName] = action;
        }
        return actionName;
    };
    Sinaif.prototype.requestData = function (data, fun) {
        if (data instanceof Object == false) {
            data = {};
        }
        if (!data.hasOwnProperty("url")) {
            data.url = "";
        }
        data.callbackname = this.registAction(fun);
        this.callApp("requestData", data);
    };
    Sinaif.prototype.redirect = function (url, bool) {
        if (bool === false) {
            window.location.href = url;
            window.location.replace(url);
            return;
        }
        var urls = url.split("?");
        var qs = location.search.substr(1);
        urls[1] = urls[1] ? (urls[1] + "&" + qs) : qs;
        window.location.href = url;
        window.location.replace(url);
    };
    Sinaif.prototype.setTitle = function (data) {
        if (!data) {
            return false;
        }
        if (typeof (data) == "string") {
            data = {
                title: data
            };
        }
        if (Object.prototype.toString.call(data) == "[object Object]") {
            if (data.title) {
                this.callApp("setTitle", data);
            }
        }
    };
    Sinaif.prototype.showHomeView = function () {
        this.callApp("showHomeView");
    };
    Sinaif.prototype.setValue = function (key, value) {
        if (value === void 0) { value = ""; }
        if (!key) {
            return;
        }
        var data = (key instanceof Object) ? key : {
            key: key,
            value: value
        };
        this.callApp("setValue", data);
    };
    Sinaif.prototype.getValue = function (key, fun) {
        if (!key) {
            return false;
        }
        var data = {
            key: key
        };
        data.callbackname = this.registAction(fun);
        this.callApp("getValue", data);
    };
    Sinaif.prototype.updata = function (name, data) {
        var _this = this;
        var obj = {
            dateformat: function () {
                var times = new Date();
                var str = "";
                str =
                    times.getFullYear() +
                        "/" +
                        (times.getMonth() + 1) +
                        "/" +
                        times.getDate() +
                        " " +
                        times.getHours() +
                        ":" +
                        times.getMinutes() +
                        ":" +
                        times.getSeconds();
                return str;
            },
            start: function (opt, fn) {
                console.log("新浪爱问普惠统计服务开始!");
                if (opt instanceof Object) {
                    for (var k in opt) {
                        if (k == "forClient" || k == "cfgId" || k == "batch") {
                            _this.updataConfig.qsjParams.sourceEventParams[k] = opt[k];
                        }
                        else {
                            _this.updataConfig.qsjParams[k] = opt[k] || "";
                        }
                    }
                }
                else {
                    console.error("请设置设备信息对象参数,如：{forClient,cfgId,batch}");
                }
                if (fn instanceof Function) {
                    _this.updataConfig.qjsCallback = fn;
                }
                else {
                    console.error("start方法请传入回调执行函数");
                }
                if (name == "qsj") {
                    _this.updataConfig.qjsCallback(UPDATA.qsj(_this.updataConfig.qsjParams));
                }
                else {
                    console.error("不能使用该服务");
                }
            }
        };
        if (name == "gio") {
            UPDATA.gio();
        }
        if (name == "sensors") {
            UPDATA.sensors();
        }
        if (name == "qsj" && data instanceof Object) {
            this.updataConfig.qjsCallback(UPDATA.qsj(__assign({}, this.updataConfig.qsjParams, data), this.updataConfig.qjsCallback));
        }
        return obj;
    };
    return Sinaif;
}());
var SINAIF = new Sinaif();
win.sendData = function (data, callbackname) {
    data = data.replace(/\n/g, " ");
    data = data.replace(/\r/g, " ");
    data = data.replace(/\s+/g, " ");
    if (typeof callbackname == "string") {
        SINAIF[callbackname](data);
    }
    else {
        callbackname(data);
    }
};
SINAIF.actions = function () {
};
SINAIF.restart = function () {
    if (SINAIF.actions instanceof Function) {
        SINAIF.actions();
    }
    else {
    }
};
win.restart = SINAIF.restart;
exports.default = SINAIF;
