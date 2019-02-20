"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var win = window;
exports.getQuery = function (key, str) {
    if (win.__querys__) {
        return key ? win.__querys__[key] : win.__querys__;
    }
    var qs = win.location.search ? win.location.search.slice(1) : "";
    if (str) {
        qs = qs + "&" + str;
    }
    var obj = {};
    if (qs) {
        var p = qs.split("&");
        p.forEach(function (v) {
            var _a;
            var x = (_a = v.split("="), _a[0]), y = _a[1];
            if (x) {
                obj[x] = y;
            }
        });
    }
    win.__querys__ = obj;
    return key ? obj[key] : obj;
};
exports.deepAssgin = function (obj1, obj2) {
    var toString = Object.prototype.toString;
    try {
        if (!Object.keys(obj1).length && obj2) {
            return obj2;
        }
        else if (!Object.keys(obj2).length && obj1) {
            return obj1;
        }
    }
    catch (error) { }
    if (toString.call(obj1) == "[object Object]") {
        obj2 = typeof obj2 == "object" ? obj2 : {};
        for (var k in obj1) {
            for (var k2 in obj2) {
                if (!obj1.hasOwnProperty(k2)) {
                    obj1[k2] = obj2[k2];
                }
                else {
                    if (!obj2.hasOwnProperty(k)) {
                        continue;
                    }
                    if (toString.call(obj1[k]) == "[object Object]" && toString.call(obj2[k]) == "[object Object]") {
                        exports.deepAssgin(obj1[k], obj2[k]);
                    }
                    else {
                        obj1[k] = obj2[k];
                    }
                }
            }
        }
        return obj1;
    }
    else {
        return {};
    }
};
exports.formatTemplate = function (result, args) {
    if (arguments.length > 1) {
        if (arguments.length == 2 && typeof (args) == "object") {
            for (var key in args) {
                if (args[key] != undefined) {
                    var reg = new RegExp("({" + key + "})", "g");
                    result = result.replace(reg, args[key]);
                }
            }
        }
        else if (arguments.length >= 2) {
            var _loop_1 = function (i) {
                if (typeof arguments_1[i] == "string") {
                    var reg = new RegExp("{%s}", "g");
                    var i_1 = 1;
                    result = result.replace(reg, function () {
                        return arguments[i_1++];
                    });
                }
            };
            var arguments_1 = arguments;
            for (var i = 0; i < arguments.length; i++) {
                _loop_1(i);
            }
        }
    }
    return result;
};
var browser = (function () {
    var u = window.navigator.userAgent;
    return {
        trident: u.indexOf("Trident") > -1,
        presto: u.indexOf("Presto") > -1,
        webKit: u.indexOf("AppleWebKit") > -1,
        gecko: u.indexOf("Gecko") > -1 && u.indexOf("KHTML") == -1,
        mobile: !!u.match(/AppleWebKit.*Mobile.*/),
        ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
        android: u.indexOf("Android") > -1 || u.indexOf("Adr") > -1 || u.indexOf("Linux") > -1,
        windowsPhone: u.indexOf("Windows Phone") > -1,
        googlePhone: u.indexOf("Google Phone") > -1,
        iPhone: u.indexOf("iPhone") > -1,
        iPad: u.indexOf("iPad") > -1,
        webApp: u.indexOf("Safari") == -1,
        weixin: u.indexOf("MicroMessenger") > -1,
        qq: u.match(/\sQQ/i),
        safari: u.match(/Safari/i),
        uc: u.match(/UCBrowser.*AliApp/i),
    };
}());
exports.getDevice = function (key) {
    if (win.__devices__) {
        return key ? win.__devices__[key] : win.__devices__;
    }
    var obj = {
        browser: browser,
        appVersion: win.navigator.appVersion,
        language: win.navigator.language,
        os: browser.android ? "android" : browser.ios ? "ios" : browser.windowsPhone ? "windows手机" : browser.googlePhone ? "google手机" : "none",
        ostype: browser.android ? 1 : browser.ios ? 2 : 3,
        webview: browser.uc ? "uc" :
            browser.weixin ? "weixin" :
                browser.qq ? "qq" :
                    browser.safari ? "safari" :
                        "none"
    };
    win.__devices__ = obj;
    return key ? obj[key] : obj;
};
exports.dropDown = function (ele, obj) {
    if (typeof ele != "object") {
        return;
    }
    if (ele.nodeType != 1) {
        return;
    }
    if (Object.prototype.toString.call(obj) != "[object Object]") {
        obj = { start: function () { }, move: function () { }, end: function () { } };
    }
    if (ele.$actions) {
        ele.$actions = obj;
        return ele;
    }
    ele.$actions = obj;
    var actionsStatus;
    Object.defineProperty(ele.$actions, "status", {
        get: function () {
            return actionsStatus;
        },
        set: function (val) {
            actionsStatus = val || "";
            if (actionsStatus != "pending") {
                ele.style.transition = "height 0.8s";
                ele.style.height = "0px";
                ele.style.display = "none";
            }
        }
    });
    var startX;
    var startY;
    var moveX;
    var moveY;
    var timeid;
    document.body.addEventListener("touchstart", function (e) {
        if (ele.$actions.status == "pending") {
            return false;
        }
        startX = e.touches[0].pageX;
        startY = e.touches[0].pageY;
        moveX = 0;
        moveY = 0;
        ele.style.height = "0px";
        ele.style.display = "none";
        if (typeof (ele.$actions.start) == "function") {
            ele.$actions.start();
        }
    }, { passive: false });
    document.body.addEventListener("touchmove", function (e) {
        var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        if (scrollTop > 0 || ele.$actions.status == "pending") {
            return false;
        }
        moveX = e.touches[0].pageX - startX;
        moveY = e.touches[0].pageY - startY;
        if (moveY > 0) {
            e.preventDefault();
        }
        else {
        }
        if (moveY > 0 && moveY < 150) {
            ele.style.height = moveY / 2 + "px";
            ele.style.lineHeight = moveY / 2 + "px";
            ele.innerHTML = "正在下拉中";
            ele.style.display = "block";
            ele.style.transition = "none";
            if (typeof (ele.$actions.move) == "function") {
                ele.$actions.move();
            }
        }
        else if (moveY >= 150) {
            ele.innerHTML = "松开刷新";
        }
        if (moveY < 0) {
            ele.style.height = "0px";
            ele.style.display = "none";
        }
    }, { passive: false });
    document.body.addEventListener("touchend", function (e) {
        if (ele.$actions.status == "pending") {
            return false;
        }
        if (moveY < 150) {
            ele.$actions.status = "";
        }
        if (typeof (ele.$actions.end) == "function" && moveY >= 150) {
            timeid = setTimeout(function () {
                ele.$actions.status = "";
            }, 15000);
            ele.innerHTML = "数据刷新中";
            ele.$actions.end();
            ele.$actions.status = "pending";
        }
    }, { passive: false });
};
