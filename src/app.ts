interface _Axios {
  (ax:any,def:any):any;
}
let _axios:_Axios;
    _axios = function(ax:any,def:any){
      if(!ax ){return false}
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
        return instance;
      }
      
    }
new Promise(function(resolve,reject){
  
})
module.exports = {
  axios:_axios
}