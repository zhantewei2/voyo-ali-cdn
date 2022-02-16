import {createHmac} from "crypto";
import {getUniqueId, encodeQuery} from "@ztwx/utils";
import {req} from "../http";
export * from "../http";

const CDN_SERVER= 'https://cdn.aliyuncs.com';

export interface CDNParameters{
  Format:string;
  Version:string;
  AccessKeyId:string;
  SignatureVersion:string;
  SignatureMethod:string;
  SignatureNonce:string;
  Signature?:string;
  Timestamp:string;
}

export interface CDNCtor{
  cdnKey:string;
  cdnSecret:string;
  cdnVersion?:string;
}



class CDN{
  cdnKey:string;
  cdnSecret:string;
  cdnServer:string= CDN_SERVER;
  cdnVersion:string;
  constructor({cdnKey,cdnSecret,cdnVersion="2018-05-10"}:CDNCtor) {
    this.cdnKey=cdnKey;
    this.cdnSecret=cdnSecret;
    this.cdnVersion= cdnVersion;
  }

  percentEncode(str:string){
    return encodeURIComponent(str)
      .replace("+","%20")
      .replace("*","%2A")
      .replace("%7E","~");
  }

  computeSignature(parameters:Record<string, any>,method:string){
    let canonicalStr="";
    Object.keys(parameters).sort().forEach((key:string)=>{
      canonicalStr+= '&'+ this.percentEncode(key) + "="+ this.percentEncode(parameters[key])
    });
    const signStr= `${method.toUpperCase()}&${this.percentEncode("/")}&`+
      this.percentEncode(canonicalStr.slice(1));
    // console.debug("signStr:",signStr)
    return createHmac("sha1",this.cdnSecret+'&').update(signStr).digest().toString("base64");
  }

  resolveParams(method:string,requestParams:{Action:string}&Record<string, any>){
    const parameters:CDNParameters={
      Format: "JSON",
      Version: this.cdnVersion,
      AccessKeyId : this.cdnKey,
      SignatureVersion: "1.0",
      SignatureMethod: "HMAC-SHA1",
      SignatureNonce: getUniqueId(),
      Timestamp: new Date().toISOString()
    };
    parameters["Signature"]=this.computeSignature({...parameters,...requestParams},method);
    return {...parameters,...requestParams};
  }

  req(
    method:string,
    requestParams:{Action:string}&Record<string, any>
  ):Promise<{
    statusCode:number,
    data:any,
    headers:Record<string, string>
  }>{

    const url=this.cdnServer+"?"+encodeQuery(
      this.resolveParams(method,requestParams),false
    );
    return req({
      method,
      url
    }).then(({statusCode,data,headers}:any)=>{
      let result;
      try{
        result=JSON.parse(data.toString());
      }catch (e){
        result=data;
      }
      return {
        statusCode,
        data:result,
        headers,
      }
    })
  }

}

export class AliYoCDN extends CDN{
  combineUrl(url:string|string[]){
    return url instanceof Array? url.join("\n"): url;
  }

  /**
   * 刷新url
   * @param url
   */
  refreshUrl(url:string|string[]){
    return this.req("get",{
      Action: "RefreshObjectCaches",
      ObjectPath: this.combineUrl(url),
      ObjectType: "File"
    })
  }

  /**
   * 刷新目录
   * @param dir
   */
  refreshDir(dir:string|string[]){
    return this.req("get",{
      Action: "RefreshObjectCaches",
      ObjectPath: this.combineUrl(dir),
      ObjectType: "Directory"
    });
  }

  /**
   * 预热url
   * @param url
   * @param area
   */
  pushUrl(url:string|string[], area:string= "domestic"){
    return this.req("get",{
      Action: "PushObjectCache",
      ObjectPath: this.combineUrl(url),
      Area: area
    });
  }

  /**
   * 查询配额信息
   */
  describeQuota(){
    return this.req("get",{
      Action: "DescribeRefreshQuota"
    });
  }

  /**
   * 查询刷新预热信息
   * @param params
   */
  describeTasks(params:{
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
  }={}){
    return this.req("get",{
      Action:"DescribeRefreshTasks",
      ...params
    });
  }
}