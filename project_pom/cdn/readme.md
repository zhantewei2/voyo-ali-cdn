---
#### 安装

```shell
npm i @voyo/ali-cdn
```

#### 例子
```javascript

const {AliYoCDN}= require("@voyo/ali-cdn");

const cdn=new AliYoCDN({
  cdnKey: "your key", //阿里云accessKeyId
  cdnSecret: "your secret", // 阿里云accessKeySecret
})

//刷新cdn url;
cdn.refreshUrl("https://www.xxx.com/xx.jpg")
  .then(result=>{})
//批量刷新
cdn.refreshUrl([
  "https://www.xxx.com/1.jpg",
  "https://www.xxx.com/2.jpg"
]) 
```

#### API

- **refreshUrl**(url: string|string[]) 刷新url
- **refreshDir**(dir: string|string[]) 刷新目录
- **pushUrl**(url: string|string[], area:string= "domestic") 预热url
- **describeQuota**() 查询配额信息
- **describeTasks** (p: `describeTasksParams`) 查询刷新预热信息

```typescript
type describeTasksParams={
    TaskId?:string;
    ObjectPath?:string;
    PageNumber?: number;
    ObjectType?:"file"|"directory"|"preload";
    DomainName?:string;
    Status?:string;
    PageSize?:string;
    StartTime?:string;
    EndTime?:string;
    ResourceGroupId?:string;
  }
```
