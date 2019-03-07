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
import { getDevice, getQuery } from "./method";
var win = window;
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
        name == "gio" && UPDATA.gio();
        name == "sensors" && UPDATA.sensors();
        if (name == "qsj" && data instanceof Object) {
            this.updataConfig.qjsCallback(UPDATA.qsj(__assign({}, this.updataConfig.qsjParams, data), this.updataConfig.qjsCallback));
        }
    };
    return Sinaif;
}());
var UPDATA = {
    qsjConfig: {},
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
        var _this = this;
        console.log("新浪爱问普惠统计服务开始!");
        if (opt instanceof Object) {
            for (var k in opt) {
                if (k == "forClient" || k == "cfgId" || k == "batch") {
                    _this.qsjConfig.sourceEventParams[k] = opt[k];
                }
                else {
                    _this.qsjConfig[k] = opt[k] || "";
                }
            }
        }
        else {
            console.error("请设置设备信息对象参数,如：{forClient,cfgId,batch}");
        }
        if (fn instanceof Function) {
            _this.qsjConfig.CALLBACK = fn;
        }
        else {
            console.error("start方法请传入回调执行函数");
        }
        if (name == "qsj") {
            _this.qsjConfig.CALLBACK(_this.qsj(_this.qsjConfig));
        }
        else {
            console.error("不能使用该服务");
        }
    },
    gio: function () {
        window.onload = function () {
            ;
            (function (e, t, n, g, i) {
                e[i] = e[i] || function () {
                    (e[i].q = e[i].q || []).push(arguments);
                };
                n = t.createElement("script");
                n.async = 1;
                n.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + g;
                var tag = document.head.getElementsByTagName("script")[0];
                tag ? tag.parentNode.insertBefore(n, tag) : document.head.appendChild(n);
            })(window, document, "script", "assets.growingio.com/2.1/gio.js", "gio");
            win.gio('init', 'be0bf9e8f4f1b9d4', {});
            win.gio('send');
        };
    },
    sensors: function () {
        ;
        (function (para) {
            var p = para.sdk_url, n = para.name, w = window, d = document, s = 'script', x = null, y = null;
            if (typeof (w['sensorsDataAnalytic201505']) !== 'undefined') {
                return false;
            }
            w['sensorsDataAnalytic201505'] = n;
            w[n] = w[n] || function (a) { return function () { (w[n]._q = w[n]._q || []).push([a, arguments]); }; };
            var ifs = ['track', 'quick', 'register', 'registerPage', 'registerOnce', 'trackSignup', 'trackAbtest', 'setProfile', 'setOnceProfile', 'appendProfile', 'incrementProfile', 'deleteProfile', 'unsetProfile', 'identify', 'login', 'logout', 'trackLink', 'clearAllRegister', 'getAppStatus'];
            for (var i = 0; i < ifs.length; i++) {
                w[n][ifs[i]] = w[n].call(null, ifs[i]);
            }
            if (!w[n]._t) {
                x = d.createElement(s), y = d.getElementsByTagName(s)[0];
                x.async = 1;
                x.src = p;
                x.setAttribute('charset', 'UTF-8');
                y.parentNode.insertBefore(x, y);
                w[n].para = para;
            }
        })({
            sdk_url: 'https://static.sensorsdata.cn/sdk/1.12.5/sensorsdata.min.js',
            heatmap_url: 'https://static.sensorsdata.cn/sdk/1.12.5/heatmap.min.js',
            name: 'sensors',
            server_url: 'https://xinlangpuhui.datasink.sensorsdata.cn/sa?token=22252313ae4a6a1a',
            heatmap: {}
        });
        win.sensors.quick('autoTrack');
    },
    qsj: function (data) {
        var _this = this;
        if (data instanceof Object == false) {
            data = {};
        }
        if (_this.qsjConfig.CALLBACK instanceof Function === false) {
            console.error("请执行start初始化任务");
            return false;
        }
        var _PARAMS = {
            timeStr: new Date(),
            productId: data.productId || getQuery("productId") || "",
            accountId: data.fromUserId || getQuery('fromUserId') || "",
            channel: data.channel || getQuery('channel') || "",
            appVersion: data.appVersion || getQuery('appVersion') || "",
            deviceId: data.deviceId || getQuery('deviceId') || "",
            source: data.source || getQuery("source") || data.productId || getQuery("productId"),
            mobileSystem: getDevice("os"),
            visitStartTime: +new Date(),
            exposureData: [],
            currentEventCode: data.currentEventCode || window.location.href,
            currentEventParams: data.currentEventParams,
            sourceEventCode: data.sourceEventCode || window.location.href,
            sourceEventParams: data.sourceEventParams,
            json: JSON.stringify([]),
        };
        if (/^ad_|tab_/.test(_PARAMS.currentEventCode) && typeof _PARAMS.currentEventParams != "object") {
            console.warn("currentEventParams参数有误");
        }
        else if (/^url_exposure/.test(_PARAMS.currentEventCode)) {
            var dom = _PARAMS.currentEventCode.substr(12);
            try {
                if (!win.ISURLEXPOSURE) {
                    var domItem = document.querySelectorAll(dom);
                    var DomViews_1 = [];
                    for (var i = 0; i < domItem.length; i++) {
                        DomViews_1.push({
                            ispost: false,
                            index: i,
                            offsetTop: _this.getDomOffset(domItem[i]),
                            offsetHeight: domItem[i].offsetHeight
                        });
                    }
                    _PARAMS.currentEventParams = [];
                    for (var _i = 0, _a = _this.getDomView(DomViews_1); _i < _a.length; _i++) {
                        var v = _a[_i];
                        if (!DomViews_1[v.index].ispost) {
                            _PARAMS.currentEventParams.push(_PARAMS.exposureData[v.index]);
                            DomViews_1[v.index].ispost = true;
                        }
                    }
                    win.addEventListener("scroll", function () {
                        _PARAMS.currentEventParams = [];
                        for (var _i = 0, _a = _this.getDomView(DomViews_1); _i < _a.length; _i++) {
                            var v = _a[_i];
                            if (!DomViews_1[v.index].ispost) {
                                _PARAMS.currentEventParams.push(DomViews_1[v.index]);
                                DomViews_1[v.index].ispost = true;
                            }
                        }
                        if (_PARAMS.currentEventParams.length > 0) {
                            _this.qsjConfig.CALLBACK instanceof Function && _this.qsjConfig.CALLBACK({ json: "[" + JSON.stringify(_PARAMS) + "]" });
                        }
                    });
                    win.ISURLEXPOSURE = true;
                }
            }
            catch (error) {
                console.error(error);
            }
            _PARAMS.currentEventCode = "url_exposure";
        }
        else if (_PARAMS.currentEventCode == _PARAMS.sourceEventCode) {
            _PARAMS.currentEventParams = getQuery();
        }
        if (!_PARAMS.deviceId) {
            console.warn("请传入deviceId");
        }
        _PARAMS.currentEventParams = typeof (_PARAMS.currentEventParams) == "object" ? JSON.stringify(_PARAMS.currentEventParams) : _PARAMS.currentEventParams;
        _PARAMS.sourceEventParams = typeof (_PARAMS.sourceEventParams) == "object" ? JSON.stringify(_PARAMS.sourceEventParams) : _PARAMS.sourceEventParams;
        return { json: "[" + JSON.stringify(_PARAMS) + "]" };
    },
    getDomOffset: function (dom) {
        var offsetTop = dom.offsetTop;
        while (dom = dom.offsetParent) {
            offsetTop += dom.offsetTop;
        }
        return offsetTop;
    },
    getDomView: function (domsdata) {
        var len = domsdata.length;
        var winHeight = document.documentElement.clientHeight || document.body.clientHeight;
        var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        var viewdoms = [];
        for (var i = 0; i < len; i++) {
            if (domsdata[i].offsetTop + domsdata[i].offsetHeight - 20 > scrollTop && domsdata[i].offsetTop + 20 < scrollTop + winHeight) {
                viewdoms.push(domsdata[i]);
            }
        }
        return viewdoms;
    }
};
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
export default SINAIF;
