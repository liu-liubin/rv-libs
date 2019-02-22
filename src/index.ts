let win:any = window;
interface IAnyObject {
  [propName: string]: any;
}

/**
 * @param key   可选  传入要获取的键值对象
 * @param str   可选  拼接url解析
 * @return   传入key获取指定的参数，不传key获取整个解析对象
 * 举个栗子
 * window.search=a=1&b=2&c3
 *   getQuery()   return {a:1,b:2,c:3}
 *   getQuery("a")  return  1
 *   getQuery("f","f=5&k=1")  return 5 
 */
interface IgetQuery {
  (key?:string,str?:string):IAnyObject;
}
export let getQuery: IgetQuery = function (key?:string,str?:string): IAnyObject {
  if(win.__querys__){
    return key ? win.__querys__[key] : win.__querys__;
  }
  let qs = win.location.search?win.location.search.slice(1):"";
  if(str){ qs = qs+"&"+str; }
  let obj: IAnyObject = {};
  if (qs) {
    let p: any[] = qs.split("&");
    p.forEach(function (v) {
      let [x,y] = v.split("=");
      if(x){
        obj[x] = y;
      }
    })
  }
  win.__querys__ = obj;
  return key?obj[key]:obj;
}


/**
 * 深拷贝合并对象，数组不合并
 * @param obj1     被覆盖对象
 * @param obj2     覆盖对象
 */
export let deepAssgin = function (obj1: IAnyObject, obj2: IAnyObject) {
  let toString = Object.prototype.toString;
  try {
    if(!Object.keys(obj1).length && obj2){
      return obj2;
    }else if(!Object.keys(obj2).length && obj1){
      return obj1;
    }
  } catch (error) { }
  if (toString.call(obj1) == "[object Object]") {
    obj2 = typeof obj2 == "object" ? obj2 : {};
    for (let k in obj1) {
      for (let k2 in obj2) {
        // 如果obj1不存在obj2的key值则直接复制为obj2的对象
        if (!obj1.hasOwnProperty(k2)) {
          obj1[k2] = obj2[k2];
        } else {
          // 如果obj2不存在obj1的key值则跳过循环
          if (!obj2.hasOwnProperty(k)) {
            continue;
          }
          if (toString.call(obj1[k]) == "[object Object]" && toString.call(obj2[k]) == "[object Object]") {
            deepAssgin(obj1[k], obj2[k]);
          } else {
            obj1[k] = obj2[k];
          }
        }
      }
    }
    return obj1
  } else {
    return {}
  }
}

/** 举个栗子
 * 1. formatTemplate("test{%s}test{%s}","1","2")
 *      console => test1test2
 * 2. formatTemplate("a:{name}b:{age}",{name:"test",age:11})
 *      console => a:testb:11
 * */
interface formatStr {
  (str: string, args: string | IAnyObject): string
}
export let formatTemplate: formatStr = function (result: string, args: string | IAnyObject) {
  if (arguments.length > 1) {
    if (arguments.length == 2 && typeof (args) == "object") {
      for (let key in args) {
        if (args[key] != undefined) {
          let reg = new RegExp("({" + key + "})", "g");
          result = result.replace(reg, args[key]);
        }
      }
    }
    else if (arguments.length >= 2) {
      for (let i = 0; i < arguments.length; i++) {
        if (typeof arguments[i] == "string") {
          let reg = new RegExp("{%s}", "g");
          let i = 1;
          result = result.replace(reg, function () {
            return arguments[i++] as string;
          });
        }
      }
    }
  }
  return result;
}


/**
 * 获取浏览器或寄存设备信息
 * @param  key  可选  获取键值对象 如果为空则返回整个对象
 */
interface getDevice {
  (key?:string):any;
}
// browser为可扩展属性
let browser = (function () {
  let u = window.navigator.userAgent;
  return {
    trident: u.indexOf("Trident") > -1, //IE内核
    presto: u.indexOf("Presto") > -1, //opera内核
    webKit: u.indexOf("AppleWebKit") > -1, //苹果、谷歌内核
    gecko: u.indexOf("Gecko") > -1 && u.indexOf("KHTML") == -1, //火狐内核
    mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
    ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),   // 是否使用ios终端
    android: u.indexOf("Android") > -1 || u.indexOf("Adr") > -1 || u.indexOf("Linux") > -1, // 是否使用android终端
    windowsPhone: u.indexOf("Windows Phone") > -1,
    googlePhone : u.indexOf("Google Phone") > -1,
    iPhone: u.indexOf("iPhone") > -1, //是否为iPhone或者QQHD浏览器
    iPad: u.indexOf("iPad") > -1, //是否iPad
    webApp: u.indexOf("Safari") == -1, //是否web应该程序，没有头部与底部
    weixin: u.indexOf("MicroMessenger") > -1, //是否微信 （2015-01-22新增）
    qq: u.match(/\sQQ/i), //是否QQ
    safari: u.match(/Safari/i),
    uc: u.match(/UCBrowser.*AliApp/i),
  };
}());
export let getDevice: getDevice = function(key?:string) {
  if(win.__devices__){
    return key?win.__devices__[key]:win.__devices__;
  }
  let obj:any = {
    browser,  // 浏览器版本内核信息
    // network: win.navigator.connection.effectiveType,  //设备使用网络
    appVersion: win.navigator.appVersion,
    language: win.navigator.language,   // 设备语言类型
    os: browser.android ? "android" : browser.ios ? "ios" : browser.windowsPhone ? "windows手机" : browser.googlePhone ? "google手机" : "none",  //设备系统
    ostype: browser.android ? 1 : browser.ios ? 2 : 3,  //系统类型编号 
    webview: browser.uc ? "uc" :      //webview基于的内核
      browser.weixin ? "weixin" :
        browser.qq ? "qq" :
          browser.safari ? "safari" :
            "none"
  }
  win.__devices__ = obj;
  return key?obj[key]:obj;
}


/**
 * 举个栗子
 * @ele    绑定dom元素，该元素显示下拉刷新状态
 *   dropDown(ele,{
 *     start(){},
 *     move(){},
 *     end(){},
 *   })
 */
interface IdropDown {
  start(): void;
  move(): void;
  end(): void;
}
export let dropDown: any = function (ele: any, obj: IdropDown) {
  if (typeof ele != "object") { return; }
  if ((ele as HTMLDivElement).nodeType != 1) { return; }
  if (Object.prototype.toString.call(obj) != "[object Object]") {
    obj = { start() { }, move() { }, end() { } }
  }

  // 单例模式，仅绑定一次
  if (ele.$actions) {
    ele.$actions = obj;
    return ele;
  }
  ele.$actions = obj;
  let actionsStatus: any;
  Object.defineProperty(ele.$actions, "status", {
    get() {
      return actionsStatus;
    },
    set(val) {
      actionsStatus = val || "";
      if (actionsStatus != "pending") {
        (ele as HTMLDivElement).style.transition = "height 0.8s";
        (ele as HTMLDivElement).style.height = "0px";
        (ele as HTMLDivElement).style.display = "none";
      }
    }
  })

  let startX: number;
  let startY: number;
  let moveX: number;
  let moveY: number;
  let timeid: any; //记录刷新超时ID
  document.body.addEventListener("touchstart", function (e) {
    if (ele.$actions.status == "pending") {
      return false;
    }
    // e.preventDefault();
    startX = e.touches[0].pageX;
    startY = e.touches[0].pageY;
    moveX = 0;
    moveY = 0;
    (ele as HTMLDivElement).style.height = "0px";
    (ele as HTMLDivElement).style.display = "none";
    if (typeof (ele.$actions.start) == "function") {
      ele.$actions.start();
    }
  }, { passive: false })

  document.body.addEventListener("touchmove", function (e) {
    let scrollTop =( document.documentElement as any).scrollTop || document.body.scrollTop;
    if (scrollTop > 0 || ele.$actions.status == "pending") {
      return false;
    }

    moveX = e.touches[0].pageX - startX;
    moveY = e.touches[0].pageY - startY;

    if (moveY > 0) {
      e.preventDefault();
    } else {

    }

    if (moveY > 0 && moveY < 150) {
      (ele as HTMLDivElement).style.height = moveY / 2 + "px";
      (ele as HTMLDivElement).style.lineHeight = moveY / 2 + "px";
      (ele as HTMLDivElement).innerHTML = "正在下拉中";
      (ele as HTMLDivElement).style.display = "block";
      (ele as HTMLDivElement).style.transition = "none";
      if (typeof (ele.$actions.move) == "function") {
        ele.$actions.move();
      }
    } else if (moveY >= 150) {
      (ele as HTMLDivElement) .innerHTML = "松开刷新";
    }
    if (moveY < 0) {
      (ele as HTMLDivElement).style.height = "0px";
      (ele as HTMLDivElement).style.display = "none";
    }

  }, { passive: false })
  document.body.addEventListener("touchend", function (e) {
    if (ele.$actions.status == "pending") {
      return false;
    }
    // 未拉动指定的刷新距离不刷新数据
    if (moveY < 150) {
      ele.$actions.status = "";
    }
    // 下拉刷新成功
    if (typeof (ele.$actions.end) == "function" && moveY >= 150) {
      // 超时取消刷新
      timeid = setTimeout(() => {
        ele.$actions.status = "";
      }, 15000);
      (ele as HTMLDivElement).innerHTML = "数据刷新中";
      ele.$actions.end();
      ele.$actions.status = "pending"; //加载中,设置状态为pending，防止异步数据未请求完就又开始重新请求
    }

  }, { passive: false })
}



/** axios.js */
import Axios from "axios";
export function axios(def:any){
  let ax:any = Axios;
  if( typeof def == "object" ){
    for(let k in def){
      (ax as any).defaults[k] = def[k];
    }
  }
  ax.use = function(type:string,def:any){
    let instance:any = ax;
    if(type == "FormData"){
      instance = ax.create(Object.assign(def,{
        transformRequest:[function (data:any) {
          let ret = []
          for (let it in data) {
            ret.push(encodeURIComponent(it) + '=' + encodeURIComponent(data[it]))
          }
          return ret.join("&")
        }],
        headers:{
          'Content-Type': 'application/x-www-form-urlencoded'
        },
      }));
    }
    for(let k in def){
      instance.defaults[k] = def[k];
    }
    return instance;
  }
  
}


/** dialog.js */
import "./styles/dialog.scss";
const $namespace = "rival-style-";
/**
 * 浏览器版本支持
 * chrome:8.0	ie:10.0	fox:3.6	safiri:5.1	opera:11.5
 */
class Dialog{
  $shadow:HTMLDivElement;    //遮罩层
  $wrapper:HTMLDivElement;   //内容容器层
  $zIndex:number=9000;       //层级
  $events:any[] = [];        //事件数据
  $shadowClose:boolean=true;
  static _self:any;
  constructor(){
    this.$shadow = document.createElement("div");
    this.$wrapper = document.createElement("div");
    this.$shadow.classList.add($namespace+"none");
    this.$wrapper.classList.add($namespace+"none");
    Dialog._self = this;
    Dialog.render();
  }
  static render(){
    let _self = Dialog._self;
    let body:any = document.body;
    if(body.dialogCreated){
      return;
    }
    _self.$shadow.classList.add($namespace+"dialog-shadow");
    // _self.$shadow.style.cssText = 'position:fixed;width:100%;height:100%;left:0;top:0;z-index:'+_self.$zIndex+';display:none;background:rgba(0,0,0,0.5)';
    // _self.$wrapper.style.cssText = 'position:fixed;z-index:'+(_self.$zIndex+1)+';display:none;';
    body.appendChild(_self.$shadow);
    body.appendChild(_self.$wrapper);
    body.dialogCreated = true;
  }
  close(){
    this.$shadow.classList.add($namespace+"none");
    this.$wrapper.classList.add($namespace+"none");
    // this.$shadow.classList.remove($namespace+"block");
    // this.$wrapper.classList.remove($namespace+"block");
    // 销毁注册事件
    for(let i=0;i<this.$events.length;i++){
      (this.$events[0][0] as HTMLDivElement).removeEventListener("click",this.$events[0][1],false);
    }
  }
  open(){
    let _this = this;
    this.$shadow.classList.remove($namespace+"none");
    this.$wrapper.classList.remove($namespace+"none");
    
    // 是否启用遮罩层关闭
    if(this.$shadowClose){
      this.$events.push([
        this.$shadow,
        function(){
          _this.close();
        }
      ])
    }    
    // 注册事件
    for(let i=0;i<this.$events.length;i++){
      (this.$events[0][0] as HTMLDivElement).addEventListener("click",this.$events[0][1],false);
    }
  }
}

class contentClass extends Dialog {
  constructor(){
    super();
  }
  render(content:string|HTMLDivElement = ""){
    this.open();
    if( content instanceof HTMLDivElement ){
      content = content.outerHTML;
    }
    this.$wrapper.classList.add($namespace+"dialog-contents");
    this.$wrapper.innerHTML = content as string;
  }
}
class loadingClass extends Dialog {
  constructor(){
    super();
    this.render();
  }
  render() {
    console.log("loadingClass")
  }
}
class tipsClass extends Dialog {
  constructor(){
    super();
  } 
  render(text?:string,time?:number) {
    super.open();
    let _this = this;
    this.$wrapper.classList.add($namespace+"dialog-tips");
    this.$wrapper.innerHTML = text as string;
    setTimeout(function(){  
      _this.close();
    },time||2500)
  }
}

/**
 * 移动端提示信息
 * @param text string|html  支持任意html字符
 * @param time number       显示时间，超过该时间自动消失
 */
export function tips(text?:string,time?:number){
  let tfun:tipsClass = (window as any).RivalDialog.tips;
  if(!tfun){
    tfun = (window as any).RivalDialog.tips = new tipsClass();
  }
  tfun.$shadowClose = false;
  tfun.render(text,time);
}
export function loading(){
  new loadingClass();
}
export function content(str:any){
  let contentAction:contentClass = (window as any).RivalDialog.content;
  if(!contentAction){
    contentAction = (window as any).RivalDialog.content = new contentClass();
  }
  contentAction.render(str);
}