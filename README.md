#### 使用Babel 7 

``` 
$ npm install --save-dev @babel/core @babel/preset-env 
$ npm install --save-dev @babel/plugin-transform-runtime 
$ npm install --save @babel/runtime 

```

#### 使用typescript

```
$ npm install --save-dev @types/node
$ npm install --save-dev typescript
```

#### Treeshaking

; cli configs
metrics-registry = "http://registry.npm.taobao.org/"
scope = ""
user-agent = "npm/6.4.1 node/v10.13.0 win32 x64"

; userconfig C:\Users\sinaif\.npmrc
//registry.npm.taobao.org/:always-auth = false
//registry.npm.taobao.org/:email = "750751099@qq.com"
//registry.npm.taobao.org/:username = "rival_liu"
registry = "http://registry.npm.taobao.org/"

; builtin config undefined
prefix = "C:\\Users\\sinaif\\AppData\\Roaming\\npm"

; node bin location = C:\Program Files\nodejs\node.exe
; cwd = G:\hyrib本地开发\npm-rvlibs
; HOME = C:\Users\sinaif
; "npm config ls -l" to show all defaults.