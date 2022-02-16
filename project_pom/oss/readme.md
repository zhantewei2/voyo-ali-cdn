Install
---

```shell
npm i @voyo/ali-oss
```
Usage
---
```typescript
const {AliYoOSS} =require("@voyo/ali-oss");

const oss=new AliYoOSS({
  accessKeyId: "",
  accessKeySecret:"",
  region: "",
  bucket: ""
});
// upload file
oss.putFile("/remote/1.jpg","/native/1.jpg").then(result=>{});
// upload directory
oss.putDir("/remote/dir","/native/dir").then(result=>{});
// update httpHeaders of file.
oss.putHeader("/remote/file",{"cache-control":"max-age=20000"});

```

use original oss method. [Reference](https://help.aliyun.com/document_detail/32067.html).
```
oss.oss[method]
```

