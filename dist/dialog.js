var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import "./styles/dialog.scss";
var $namespace = "rival-style-";
var Dialog = (function () {
    function Dialog() {
        this.$zIndex = 9000;
        this.$events = [];
        this.$shadowClose = true;
        this.$shadow = document.createElement("div");
        this.$wrapper = document.createElement("div");
        this.$shadow.classList.add($namespace + "none");
        this.$wrapper.classList.add($namespace + "none");
        Dialog._self = this;
        Dialog.render();
    }
    Dialog.render = function () {
        var _self = Dialog._self;
        var body = document.body;
        if (body.dialogCreated) {
            return;
        }
        _self.$shadow.classList.add($namespace + "dialog-shadow");
        body.appendChild(_self.$shadow);
        body.appendChild(_self.$wrapper);
        body.dialogCreated = true;
    };
    Dialog.prototype.close = function () {
        this.$shadow.classList.add($namespace + "none");
        this.$wrapper.classList.add($namespace + "none");
        for (var i = 0; i < this.$events.length; i++) {
            this.$events[0][0].removeEventListener("click", this.$events[0][1], false);
        }
    };
    Dialog.prototype.open = function () {
        var _this = this;
        this.$shadow.classList.remove($namespace + "none");
        this.$wrapper.classList.remove($namespace + "none");
        if (this.$shadowClose) {
            this.$events.push([
                this.$shadow,
                function () {
                    _this.close();
                }
            ]);
        }
        for (var i = 0; i < this.$events.length; i++) {
            this.$events[0][0].addEventListener("click", this.$events[0][1], false);
        }
    };
    return Dialog;
}());
var contentClass = (function (_super) {
    __extends(contentClass, _super);
    function contentClass() {
        return _super.call(this) || this;
    }
    contentClass.prototype.render = function (content) {
        if (content === void 0) { content = ""; }
        this.open();
        if (content instanceof HTMLDivElement) {
            content = content.outerHTML;
        }
        this.$wrapper.classList.add($namespace + "dialog-contents");
        this.$wrapper.innerHTML = content;
    };
    return contentClass;
}(Dialog));
var loadingClass = (function (_super) {
    __extends(loadingClass, _super);
    function loadingClass() {
        var _this_1 = _super.call(this) || this;
        _this_1.render();
        return _this_1;
    }
    loadingClass.prototype.render = function () {
        console.log("loadingClass");
    };
    return loadingClass;
}(Dialog));
var tipsClass = (function (_super) {
    __extends(tipsClass, _super);
    function tipsClass() {
        return _super.call(this) || this;
    }
    tipsClass.prototype.render = function (text, time) {
        _super.prototype.open.call(this);
        var _this = this;
        this.$wrapper.classList.add($namespace + "dialog-tips");
        this.$wrapper.innerHTML = text;
        setTimeout(function () {
            _this.close();
        }, time || 2500);
    };
    return tipsClass;
}(Dialog));
export function tips(text, time) {
    var tfun = window.RivalDialog.tips;
    if (!tfun) {
        tfun = window.RivalDialog.tips = new tipsClass();
    }
    tfun.$shadowClose = false;
    tfun.render(text, time);
}
export function loading() {
    new loadingClass();
}
export function content(str) {
    var contentAction = window.RivalDialog.content;
    if (!contentAction) {
        contentAction = window.RivalDialog.content = new contentClass();
    }
    contentAction.render(str);
}
