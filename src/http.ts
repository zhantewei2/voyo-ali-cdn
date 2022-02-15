import {encodeQuery, isObject} from "@ztwx/utils";

export interface HttpParams{
  method: string;
  url: string;
  query?: Record<string, any>;
  data?: Buffer|Record<string, any>|string;
  headers?: Record<string, any>;
}

export const req=(opts:HttpParams)=>{
  return new Promise((
    resolve,reject
  )=>{
    const request=opts.url.startsWith("https")?
      require("https").request:
      require("http").request;

    if(opts.query)opts.url+="?"+encodeQuery(opts.query);

    const req=request(
      opts.url,
      {method: opts.method},
      (res)=>{
        let buf=Buffer.from([]);
        res.on("data",chunk=>{
          buf=Buffer.concat([buf,chunk]);
        });
        res.on("end",()=>{
          resolve({
            statusCode: res.statusCode,
            data: buf,
            headers: res.headers
          });
        });
      });
    if(opts.data){
      if(isObject(opts.data)){
        req.write(Buffer.from(JSON.stringify(opts.data)))
      }else if(opts.data instanceof Buffer){
        req.write(opts.data);
      }else if(typeof opts.data ==="string"){
        req.write(Buffer.from(opts.data));
      }
    }
    req.end();
  })
}