import {AliOSS, AliYoOssCtor, PathType, PutDirOpts, PutFileType, PutOpts, PutResult} from "./types";
import {putDir} from "./tool/putDir";
export * from "../http";

const OSS=require("ali-oss");





export class AliYoOSS{
    oss:AliOSS;
    constructor(params:AliYoOssCtor) {
        this.oss=new OSS(params);
    }

    /**
     * 直接修改header
     * @param filename
     * @param headers
     */
    putHeader(filename:string,headers:Record<string, string>){
        return this.oss.copy(filename,filename,{headers});
    }

    /**
     * 上传文件
     * @param remoteFilePath
     * @param nativeFile
     * @param opts
     */
    putFile(remoteFilePath:PathType,nativeFile:PutFileType,opts?:PutOpts) :Promise<PutResult>{
        return this.oss.put(remoteFilePath,nativeFile,opts)
    }

    /**
     * 上传文件夹
     * @param remoteDirPath
     * @param nativeDirPath
     * @param opts
     */
    putDir(remoteDirPath:PathType,nativeDirPath:PathType,opts?:PutDirOpts){
        return putDir(this.oss,remoteDirPath,nativeDirPath,opts);
    }
}

