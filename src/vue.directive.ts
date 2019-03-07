export default {
  install(Vue:any,options?:any){
    /**
     * 解决retia屏或1px显示过粗的问题
     * 使用示例：
     *   1. <div fixed v-border1px="'#ccc'"></div>
     *   2. <div absolute v-border1px.top="'#ccc'"></div>
     * 元素属性position默认使用relative，如果设置了属性fixed|absolute
     */
    Vue.directive("border1px",{
      bind(el:HTMLDivElement,binding:object,vnode:any,oldVnode:any){

      },
      inserted(el:HTMLDivElement,binding:any){
        let newele = document.createElement("div");
        let oldele = el;
        let oldhtml = el.innerHTML;
        // 根据修饰词并判断显示border的哪条边
        let attrs = "";
        if(binding.modifiers.top){
          attrs += "border-top:solid 1px " + binding.value +";";
        }
        if(binding.modifiers.left){
          attrs += "border-left:solid 1px " + binding.value +";";
        }
        if(binding.modifiers.right){
          attrs += "border-right:solid 1px " + binding.value +";";
        }
        if(binding.modifiers.bottom){
          attrs += "border-bottom:solid 1px " + binding.value +";";
        }
        if(!Object.keys(binding.modifiers).length){
          attrs += "border:solid 1px " + binding.value +";";
        }
        let linediv = document.createElement("div");
            linediv.setAttribute("style",`
            position: absolute;
            padding:inherit;
            width: 200%;
            height: 200%;
            left: 0;
            top: 0;
            transform: scale(0.5);
            border-radius: inherit;
            transform-origin: 0 0;
            box-sizing: border-box;
            ${attrs}
            `);
        for(let i=0;i<el.attributes.length;i++){
          let {nodeName,nodeValue} = el.attributes.item(i);
          newele.setAttribute(nodeName,nodeValue);
        }
        if(el.hasAttribute("fixed")){
          newele.style.position = "fixed";
        }else if(el.hasAttribute("absolute")){
          newele.style.position = "absolute";
        }else{
          newele.style.position = "relative";
        }
        newele.innerHTML = oldhtml;
        newele.appendChild(linediv);
        el.parentNode.replaceChild(newele,oldele);
      },
      componentUpdated(el:HTMLDivElement,binding:object){
      },
      update(el:HTMLDivElement,binding:object){
      }
    })
  }
}
