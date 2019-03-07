import "./styles/dialog.scss";
const $namespace = "rival-style-";
let win:any = window;
    win.RivalDialog = {}
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
  // 关闭弹窗
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
  // 开启弹窗
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
  // 设置遮罩透明度
  setOpacity(num:number){
    this.$shadow.classList.add($namespace+"transparent"+num);
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
    this.$shadowClose = false;
    this.setOpacity(0);
    this.render();
  }
  render() {
    this.open();
    this.$wrapper.classList.add($namespace+"dialog-loading");
    this.$wrapper.innerHTML = `
    <svg class="loadingsvg"  viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" 
    xmlns:xlink="http://www.w3.org/1999/xlink" >
      <path fill="currentColor" d="M834.7648 736.3584a5.632 5.632 0 1 0 11.264 0 5.632 5.632 0 0 0-11.264 0z m-124.16 128.1024a11.1616 11.1616 0 1 0 22.3744 0 11.1616 11.1616 0 0 0-22.3744 0z m-167.3216 65.8944a16.7936 16.7936 0 1 0 33.6384 0 16.7936 16.7936 0 0 0-33.6384 0zM363.1616 921.6a22.3744 22.3744 0 1 0 44.7488 0 22.3744 22.3744 0 0 0-44.7488 0z m-159.744-82.0224a28.0064 28.0064 0 1 0 55.9616 0 28.0064 28.0064 0 0 0-56.0128 0zM92.672 700.16a33.6384 33.6384 0 1 0 67.2256 0 33.6384 33.6384 0 0 0-67.2256 0zM51.2 528.9984a39.168 39.168 0 1 0 78.336 0 39.168 39.168 0 0 0-78.336 0z m34.1504-170.0864a44.8 44.8 0 1 0 89.6 0 44.8 44.8 0 0 0-89.6 0zM187.904 221.7984a50.432 50.432 0 1 0 100.864 0 50.432 50.432 0 0 0-100.864 0zM338.432 143.36a55.9616 55.9616 0 1 0 111.9232 0 55.9616 55.9616 0 0 0-111.9744 0z m169.0112-4.9152a61.5936 61.5936 0 1 0 123.2384 0 61.5936 61.5936 0 0 0-123.2384 0z m154.7776 69.632a67.1744 67.1744 0 1 0 134.3488 0 67.1744 67.1744 0 0 0-134.3488 0z m110.0288 130.816a72.8064 72.8064 0 1 0 145.5616 0 72.8064 72.8064 0 0 0-145.5616 0z m43.7248 169.472a78.3872 78.3872 0 1 0 156.8256 0 78.3872 78.3872 0 0 0-156.8256 0z" >
      </path>
    </svg>
    `;
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
  let tfun:tipsClass = win.RivalDialog.tips;
  if(!tfun){
    tfun = win.RivalDialog.tips = new tipsClass();
  }
  tfun.$shadowClose = false;
  tfun.render(text,time);
}
export function loading(){
  let loadingAction:loadingClass = win.RivalDialog.loading;
  if(!loadingAction){
    loadingAction = win.RivalDialog.loading = new loadingClass();
  }
}
export function content(str:any){
  let contentAction:contentClass = win.RivalDialog.content;
  if(!contentAction){
    contentAction = win.RivalDialog.content = new contentClass();
  }
  contentAction.render(str);
}