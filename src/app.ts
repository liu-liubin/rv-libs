import sinaif from "./sinaif/v01";
import Axios from "axios";
export function axios(def:any){
  let ax:any = Axios;
  if( typeof def == "object" ){
    for(let k in def){
      ax.defaults[k] = def[k];
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

export let SINAIF:any=sinaif;
