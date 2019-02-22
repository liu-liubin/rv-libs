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