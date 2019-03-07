import { getDevice,getQuery } from "./method";

let win:any = window;
interface IAnyObject {
  [propName:string]: any;
}
class Sinaif implements IAnyObject {
  private callBackAction:any[] = [];
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
    } else {
      let qsArr = [];
      for (let key in data) {
        if (data.hasOwnProperty(key)) {
          qsArr.push( key + "=" + encodeURIComponent(data[key]) );
        }
      }
      url += "?" + qsArr.join("&");
    }
    console.log(win.decodeURIComponent(url));
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
   *    qsj示例
   * ```
   * # start方法包含2个参数，arg1传入配置参数,arg2需求执行的函数比如上报数据请求API
   * SINAIF.updata("qsj").start({},function(data){})  #页面曝光，在页面加载需优先使用该方法 
   * SINAIF.updata("qsj",{})    #在上面方法执行一次的情况下使用 {} API上报的参数配置
   * ```
   */
  updata(name:string,data?:any){
    
    name=="gio" &&  UPDATA.gio();
    name=="sensors" && UPDATA.sensors();
    name=="qjs" && UPDATA.qsj(data);
    return UPDATA;
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
const UPDATA:any = {
  // 轻松借数据上报配置
  qsjConfig:{
    sourceEventParams:{},
    start:false, //是否执行过start方法
    domItem:[],  //执行曝光的元素对象
    domData:[]   //映射曝光元素对象数据
  },
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
   *   .productId
   * @fn   Function    埋点上报方法，通常为请求执行方法
   *   - params  传递参数
   */
  start(opt:any,fn:any){
    let _this = this;
    console.log("新浪爱问普惠统计服务开始!");
    _this.qsjConfig.start = true;
    if(opt instanceof Object){
      for(let k in opt){
        if(k == "forClient" || k == "cfgId" || k == "batch"){
          _this.qsjConfig.sourceEventParams[k] = opt[k];
        }else{
          _this.qsjConfig[k] = opt[k]||"";
        }
      }
    }else{
      console.error("请设置设备信息对象参数,如：{forClient,cfgId,batch}")
    }
    if(fn instanceof Function){
      _this.qsjConfig.CALLBACK = fn;
      _this.qsjConfig.CALLBACK(_this.qsj(_this.qsjConfig));
    }else{
      console.error("start方法请传入回调执行函数")
    }
    // if(name=="qsj"){
    //   _this.qsjConfig.CALLBACK(_this.qsj(_this.qsjConfig));
    // }else{
    //   console.error("不能使用该服务")
    // }
  },
  gio(){
    // 需保证方法优先于应用加载
    // 引入gio 数据全埋点
    // 官方文档：https://docs.growingio.com/docs/sdk-integration/web-js-sdk/#4-zi-ding-yi-shu-ju-shang-chuan
    window.onload = function(){
      ;(function(e:any,t:any,n:any,g:any,i:any){
        e[i]=e[i]||function(){
          (e[i].q=e[i].q||[]).push(arguments)
        }
        n=t.createElement("script");
        n.async=1;
        n.src=('https:'==document.location.protocol?'https://':'http://')+g;
        let tag:any = document.head.getElementsByTagName("script")[0];
        tag? tag.parentNode.insertBefore(n,tag) :document.head.appendChild(n);
      })(window,document,"script","assets.growingio.com/2.1/gio.js","gio");
      win.gio('init','be0bf9e8f4f1b9d4', {});    
      win.gio('send');
    }
  },
  sensors(){
    // 需保证方法优先于应用加载
    // 引入神策数据全埋点 
    ;(function(para:any) {
      var p:any = para.sdk_url, n:any = para.name, w:any = window, d:any = document, s:any = 'script',x = null,y = null;
      if(typeof(w['sensorsDataAnalytic201505']) !== 'undefined') {
          return false;
      }
      w['sensorsDataAnalytic201505'] = n;
      w[n] = w[n] || function(a:any) {return function() {(w[n]._q = w[n]._q || []).push([a, arguments]);}};
      var ifs = ['track','quick','register','registerPage','registerOnce','trackSignup', 'trackAbtest', 'setProfile','setOnceProfile','appendProfile', 'incrementProfile', 'deleteProfile', 'unsetProfile', 'identify','login','logout','trackLink','clearAllRegister','getAppStatus'];
      for (var i = 0; i < ifs.length; i++) {
        w[n][ifs[i]] = w[n].call(null, ifs[i]);
      }
      if (!w[n]._t) {
        x = d.createElement(s), y = d.getElementsByTagName(s)[0];
        x.async = 1;
        x.src = p;
        x.setAttribute('charset','UTF-8');
        y.parentNode.insertBefore(x, y);
        w[n].para = para;
      }
    })({
      sdk_url: 'https://static.sensorsdata.cn/sdk/1.12.5/sensorsdata.min.js',
      heatmap_url: 'https://static.sensorsdata.cn/sdk/1.12.5/heatmap.min.js',
      name: 'sensors',
      server_url: 'https://xinlangpuhui.datasink.sensorsdata.cn/sa?token=22252313ae4a6a1a',
      heatmap:{}
    });
    win.sensors.quick('autoTrack');
  },
  qsj(data?:any){
    let _this = this;
    if(_this.qsjConfig.start!==true){
      console.log("请执行start初始化任务");
      return ;
    }
    if(data instanceof Object === false){
      data = {}
    }
    if(_this.qsjConfig.CALLBACK instanceof Function === false){
      console.error("未发现callback方法");
      return false;
    }
    // 数组 - 曝光数据源  通常用于映射dom对象
    let exposureData:any[] = data.exposureData||[];
    
    // 数据上报所需参数，对data参数进行评审处理
    let _PARAMS:any = {
      timeStr: new Date(),
      productId:  data.productId  || getQuery("productId") || "",
      accountId:  data.fromUserId || getQuery('fromUserId') || "",
      channel:    data.channel    || getQuery('channel') || "",
      appVersion: data.appVersion || getQuery('appVersion') || "",
      deviceId:   data.deviceId   || getQuery('deviceId') || "",
      source:     data.source || getQuery("source") || data.productId || getQuery("productId"),
      mobileSystem: getDevice("os"),  //设备系统andorid或ios
      visitStartTime:  +new Date(),   //访问页面时间 
      currentEventCode: data.currentEventCode || window.location.href,
      currentEventParams: data.currentEventParams,
      sourceEventCode: data.sourceEventCode || window.location.href,
      sourceEventParams: data.sourceEventParams,
      json:JSON.stringify([]),
    };
    
    // 普通曝光
    if(/^ad_|tab_/.test(_PARAMS.currentEventCode) && typeof _PARAMS.currentEventParams!="object"){
      console.warn("currentEventParams参数有误")
    }
    // 精准曝光
    else if( /^url_exposure/.test(_PARAMS.currentEventCode) ){
      console.warn("精准数据曝光")
      let dom = _PARAMS.currentEventCode.substr(12);
      // console.warn("请关注是否有对精准爆光元素做数据处理，设置参数scrollSetdata");
      try { 
        if(!win.ISURLEXPOSURE){
          // _this.getDomView 对曝光元素做处理
          let domItem:any = _this.qsjConfig.domItem = document.querySelectorAll(dom);
          // let DomViews:any = [];
          for(let i=0;i<domItem.length;i++){
            _this.qsjConfig.domData.push({
              ispost : false, // 是否被标记上报过数据
              index:i,
              offsetTop:_this.getDomOffset(domItem[i]), //获取元素距离内容顶部的位置
              offsetHeight:domItem[i].offsetHeight  //获取元素高度
            });
          }
          _PARAMS.currentEventCode = "url_exposure";
          _PARAMS.currentEventParams = [];
          let DomViews:any = _this.qsjConfig.domData;
          for(let v of _this.getDomView(DomViews)){
            if( !DomViews[v.index].ispost && exposureData[v.index] ){
              _PARAMS.currentEventParams.push(exposureData[v.index]);
              DomViews[v.index].ispost = true;
            }
          }
          if(_PARAMS.currentEventParams.length>0){
            _this.qsjConfig.CALLBACK instanceof Function && _this.qsjConfig.CALLBACK({json:"[" + JSON.stringify(_PARAMS) +"]"});
          }
          win.addEventListener("scroll",function(){
            _PARAMS.currentEventParams = [];
            for(let v of _this.getDomView(DomViews)){
              if( !DomViews[v.index].ispost && exposureData[v.index] ){
                _PARAMS.currentEventParams.push(exposureData[v.index]);
                DomViews[v.index].ispost = true;
              }
            }
            if(_PARAMS.currentEventParams.length>0){
              _this.qsjConfig.CALLBACK instanceof Function && _this.qsjConfig.CALLBACK({json:"[" + JSON.stringify(_PARAMS) +"]"});
            }
            
          });
          win.ISURLEXPOSURE = true;
        }else{
          console.warn("请勿重复执行精准曝光")
        }
      } catch (error) {
        console.error(error)
      }
      _PARAMS.currentEventCode = "url_exposure";
      
    }
    // 页面曝光
    else if(_PARAMS.currentEventCode==_PARAMS.sourceEventCode){
      _PARAMS.currentEventParams =  getQuery();
    }

    if(!_PARAMS.deviceId){
      console.warn("请传入deviceId")
    }
    _PARAMS.currentEventParams = typeof(_PARAMS.currentEventParams) == "object" ? JSON.stringify(_PARAMS.currentEventParams) : _PARAMS.currentEventParams;
    _PARAMS.sourceEventParams = typeof(_PARAMS.sourceEventParams) == "object" ? JSON.stringify(_PARAMS.sourceEventParams) : _PARAMS.sourceEventParams;
    return {json:"[" + JSON.stringify(_PARAMS) +"]"};
  },
  // 获取元素距离内容顶部的距离
  getDomOffset(dom:any){
    let offsetTop = dom.offsetTop;
    while(dom = dom.offsetParent){
      offsetTop += dom.offsetTop;
    }
    return offsetTop;
  },
  // 获取在视窗内的元素
  getDomView(domsdata:any){
    let len = domsdata.length;
    let winHeight = document.documentElement.clientHeight || document.body.clientHeight;
    let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    let viewdoms = [];
    for(let i=0;i<len;i++){
      // 判断元素是否还在视窗内
      if (domsdata[i].offsetTop + domsdata[i].offsetHeight - 20 > scrollTop && domsdata[i].offsetTop + 20 < scrollTop + winHeight){
        viewdoms.push(domsdata[i]);
      }
    }
    return viewdoms;
  }
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
SINAIF.actions = function(){}
// 关闭窗口监听并触发原生restart方法，如SINAIF.closeItem，物理返回按键
// 部分系统原生APP将方法注册在了SINAIF上
SINAIF.restart = function(){
  if(SINAIF.actions instanceof Function){
    SINAIF.actions();
  }else{
  }
}
// 部分系统原生APP将方法注册在了window上
win.restart = SINAIF.restart;
export default SINAIF;