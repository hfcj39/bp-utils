
# install
```
npm install github:hfcj39/bp-utils
```

瞎写几个函数平时自己用

`matchHTML()` 去HTML标签

`creatToken()` 生成jwt Token

`ensureAuthenticated()` 验证Token

`cors()` 跨域

`diskStore()` 传入上传文件路径作为参数，`router.post('/xxx',diskStore('./public/temp').single('file'),func)`

`memoryStore()`

2017.12.21  简单实现LRU算法本地缓存功能，用法：
```javascript
let cache = require('bp-utils').LRU_cache;
let local_cache = new cache(5,9999);//大小，时间(毫秒)
local_cache.set('key',{value:'test'});
console.log(local_cache.get('key'));
```
