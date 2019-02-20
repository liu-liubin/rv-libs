let win:any = window;
let UPDATA:any;
interface IAnyObject {
  [propName:string]: any;
}

class Sinaif implements IAnyObject {
  private callBackAction:any[] = [];
  //设置数据埋点方法updata通用常规信息
  private _updataInfo:IAnyObject = {
    sourceEventParams:{}
  };
  // 配置数据埋点方法
  private updataConfig:IAnyObject = {
    qsjParams:{
      sourceEventParams : {},
    },
    qjsCallback(){}
  }

  private debug:boolean = parseInt(window.location.port)>=8860 && parseInt(window.location.port)<=8880;
  static urls:IAnyObject;
  constructor(){
    this.loadingClose();
  }


  /* 弹出一个自定义的单页面 
   * data  @object 
   *    * title   @string  app窗口标题
   *    * url     @string  传入一个单页面链接地址
   *    ? width   @numer [0 - 1]
   *    ? height  @numer [0 - 1]
   */
  alertCustomWebInfoDiaLog(data:IAnyObject, action?:any) {
    if( typeof data != "object" ){ data = {} }
    this.callApp("alertCustomWebInfoDialog", data );
    if(this.debug && action instanceof Function){
      action()
    }
  }

  // 建立伪协议通道
  callApp(url:string, data?:IAnyObject) {
    url = "hsinaif://" + encodeURIComponent(url);
    if (typeof data != "object") {
      data = {}
      // console.error("请输入Object类型");
      // return;
    } else {
      let qsArr = [];
      for (let key in data) {
        if (data.hasOwnProperty(key)) {
          qsArr.push( key + "=" + encodeURIComponent(data[key]) );
        }
      }
      url += "?" + qsArr.join("&");
    }    
    console.log(url);
    // window.localStorage.setItem("sinaif_callapp_log",window.decodeURIComponent(url))
    win.location.jumpurl = win.decodeURIComponent(url);
    var iframe = document.createElement("iframe");
    iframe.style.width = "1px";
    iframe.style.height = "1px";
    iframe.style.display = "none";
    iframe.src = url;
    document.body.appendChild(iframe);
    setTimeout(function() {
      iframe.remove();
    }, 100);
  }

  // 关闭当前原生窗口
  closeItem() {
    this.callApp("closeItem");
    if(this.debug){
      // window.history.go(-1);
    }
  }
  // 关闭当前及上一层原生窗口，关闭两层窗口
  closeBackItem() {
    this.callApp("closeBackItem");
  }

  // 原生APP获取首页请求数据
  getHomeData(obj:IAnyObject,fun:any) {
    let callbackname = this.registAction(fun);
    this.callApp("getHomeData", {callbackname,needRefresh:"Yes"});
  }

  // 关闭原生APP的加载效果
  // 由于原生在打开新窗口时会默认有loading效果，页面中首次加载需要调用此方法关闭loading
  loadingClose() {
    this.callApp("loadingClose");
  }
  //展示原生的加载效果 - 打开新窗口时的加载有效
  loadingShow() {
    this.callApp("loadingShow");
  }
  // 使用原生加载效果 - 菊花样式
  loadingDialogShow() {
    this.callApp("loadingDialogShow");
  }
  // 关闭原生加载效果 - 菊花样式
  loadingDialogClose(){
    this.callApp("loadingDialogClose");
  }


  /**
   * 打开APP所在设备的设置权限位置
   */
  mobileSetting(){
    this.callApp("mobileSetting")
  }

  /* 重新开启一个新的原生APP窗口
   * data  @object 
   *    * title   @string  app窗口标题
   *    * url     @string  传入一个单页面链接地址
   *    * hsinaif   @string  默认为空，值等于"third"表示不携带原生url参数
   */
  openWin(data:IAnyObject, action?:any) {
    if(data instanceof Object == false){
      data = {}
    }
    if(!data.title){
      console.error("请传入参数title");
    }
    if(!data.url){
      console.error("请传入参数url");
    }
    this.callApp("openWin", data);
    if(this.debug && action instanceof Function){
      action()
    }
  }

  /**
   * 关闭当前窗口并打开新窗口
   * @data  Object  eg:{title:"",url:""}
   */
  openBackWin(data:IAnyObject) {
    if(data instanceof Object == false){
      data = {}
    }
    if(!data.title){
      console.error("请传入参数title");
    }
    this.callApp("openBackWin", data);
  }

  popstate(fun:any){
    window.history.pushState("sinaif.popstate","",document.referrer||window.location.href);
    window.addEventListener("popstate",function(event:any){
      if(event.state != "sinaif.popstate"){
        if(fun instanceof Function){
          fun(window.history)
        }else{
          window.history.go(-1);
        }
      }
    })
  }

  // this.callApp("queryStatus", data);
  /**
   * 跳转至APP产品首页并刷新首页数据，部分APP不支持IOS系统
   * bool  默认为true
   **/ 
  queryStatus(data:boolean|IAnyObject=true){
    let o:IAnyObject = {isHomePage:"false"}
    if(data===true){
      o.isHomePage = "true"
    }
    if( Object.prototype.toString.call(data) == "[object Object]" ){
     o = (data as IAnyObject); 
    }
    this.callApp("queryStatus", o);
  }


  // 注册全局方法并执行一次该方法action，每个方法推入栈中
  registAction(action:any):string {
    if(action instanceof Function == false){
      return "";
    }else{
      // action();
    }
    let actionName = "callBackAction" + this.callBackAction.length;
    this.callBackAction.push({name:actionName});
    Object.defineProperty(this,actionName,{
      value:action
    })
    if (win[actionName]) {
    } else {
      win[actionName] = action;
    }
    return actionName;
  }


  /*
   * 通过APP的服务器请求转发数据
   * data   传参
   *   .url   请求服务器地址
   * fun    注册为全局方法
   */
  requestData(data:IAnyObject, fun:any) {
    if(data instanceof Object == false){
      data = {}
    }
    if( !data.hasOwnProperty("url") ){
      data.url = "";
    }
    data.callbackname = this.registAction(fun);
    this.callApp("requestData", data);
  }

  /**
   * 在sinifAPP内跳转，目的是自动携带原生url参数
   * @url  string  要跳转的url
   * @bool  boolean   默认为true表示携带参数 ,false表示不携带参数直接跳转url
   */
  redirect(url:string,bool:boolean):void{
    if(bool===false){
      window.location.href = url;
      window.location.replace(url);
      return;
    }
    let urls = url.split("?");
    let qs:string = location.search.substr(1);
        urls[1] = urls[1]? (urls[1]+"&"+qs) : qs ;
    window.location.href = url;
    window.location.replace(url);
  }

  /**
   * 设置APP标题文字
   * this.setTitle("我是标题") || this.setTitle({title:"我是标题"})
   */
  setTitle (data:any) {
    if(!data){return false}
    if( typeof(data) == "string" ){
      data = {
        title:data
      }
    }
    if( Object.prototype.toString.call(data) == "[object Object]" ){
      if(data.title){
        this.callApp("setTitle", data);
      }
    }
  }

  showHomeView(){
    this.callApp("showHomeView");
  }

  /**
   * hsinaif://setValue  
   * @key     必传    设置关键词
   * @value   必传    设置存储的值 , 不可设置为空值
   */
  setValue (key:string|Object,value:any="") {
    if(!key){
      return;
    }
    let data:IAnyObject = (key instanceof Object) ? key : {
      key:key,
      value:value
    }
    this.callApp("setValue", data);
  }
  //hsinaif://setValue 
  getValue(key:string, fun:any) {
    if(!key){
      return false;
    }
    let data:IAnyObject = {
      key:key
    }
    data.callbackname = this.registAction(fun);
    this.callApp("getValue", data);
  }

  /**
   * 数据埋点及上报需求
   * name
   *   =gio 
   *   =sensors
   *   =qsj
   */
  updata(name:string,data:any){
    let _this = this;
    let obj = {
      dateformat(){
        let times = new Date();
        let str = "";
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
      /**
       * @opt  Object  设置设备信息,在页面初始曝光时候设置
       *   .forClient
       *   .cfgId
       *   .batch
       * @fn   Function    埋点上报方法，通常为请求执行方法
       *   - params  传递参数
       */
      start(opt:any,fn:any){
        console.log("新浪爱问普惠统计服务开始!");
        if(opt instanceof Object){
          for(let k in opt){
            if(k == "forClient" || k == "cfgId" || k == "batch"){
              _this.updataConfig.qsjParams.sourceEventParams[k] = opt[k]
            }else{
              _this.updataConfig.qsjParams[k] = opt[k]||""
            }
          }
        }else{
          console.error("请设置设备信息对象参数,如：{forClient,cfgId,batch}")
        }
        if(fn instanceof Function){
          _this.updataConfig.qjsCallback = fn;
        }else{
          console.error("start方法请传入回调执行函数")
        }
        if(name=="qsj"){
          _this.updataConfig.qjsCallback(UPDATA.qsj(_this.updataConfig.qsjParams));
        }else{
          console.error("不能使用该服务")
        }
      }
    }
    if(name=="gio"){
      UPDATA.gio();
    }
    if(name=="sensors"){
      UPDATA.sensors();
    }
    if(name=="qsj" && data instanceof Object){
      this.updataConfig.qjsCallback(
        UPDATA.qsj({
          ...this.updataConfig.qsjParams,
          ...data       
        },this.updataConfig.qjsCallback)
      )
    }
    return obj;
  }
  /**
   * data Ojbect
   *   
   */
  // "middle", "2000", undefined, true
  // toast(data:IAnyObject,action?:any){
  //   this.callApp("toast",data);
  // }


}
const SINAIF:IAnyObject = new Sinaif();
win.sendData = function(data:any, callbackname:any) {
  data = data.replace(/\n/g, " "); //\r
  data = data.replace(/\r/g, " ");
  data = data.replace(/\s+/g, " ");
  if (typeof callbackname == "string") {
    SINAIF[callbackname](data);
  } else {
    callbackname(data);
  }
};
SINAIF.actions = function(){

}
// 关闭窗口监听并触发原生restart方法，如SINAIF.closeItem，物理返回按键
SINAIF.restart = function(){
  if(SINAIF.actions instanceof Function){
    SINAIF.actions();
  }else{
  }
}
win.restart = SINAIF.restart;
export default SINAIF;