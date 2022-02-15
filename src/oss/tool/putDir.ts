import {AliOSS, PathType, PutDirOpts} from "../types";
import fs from "fs/promises";
import path from "path";

import {createReadStream} from "fs";

type FileStatistic={
    total:number;
    current:number;
    info: {remoteDirPath:string,nativeDirPath:string}[]
}

const _putDir=async(oss:AliOSS,remoteDirPath:PathType,nativeDirPath:PathType,opts:PutDirOpts,statistic:FileStatistic)=>{
    const stat=await fs.lstat(nativeDirPath);
    if(stat.isDirectory()){
        const filenames=await fs.readdir(nativeDirPath);
        for(let filename of filenames){
            await _putDir(
                oss,
                path.join(remoteDirPath,filename),
                path.join(nativeDirPath,filename),
                opts,
                statistic
            )
        }
    }else if(stat.isFile()){
        if(opts&&opts.excludeRegs&&opts.excludeRegs.find(regExp=>regExp.test(nativeDirPath)))return;
        statistic.total++;
        statistic.info.push({
            remoteDirPath:remoteDirPath.replace(/\\/g,"/"),
            nativeDirPath
        })
    }
}


export const putDir=async(oss:AliOSS,remoteDirPath:PathType,nativeDirPath:PathType,opts:PutDirOpts={})=>{

    const statistic:FileStatistic={
        total:0,
        current:0,
        info:[]
    }

    await _putDir(oss,remoteDirPath,nativeDirPath,opts,statistic);

    for(let i of statistic.info){
        const readStream=createReadStream(i.nativeDirPath);
        try {
            await oss.put(i.remoteDirPath, readStream, opts.putOpts);
            statistic.current++;
            console.debug(`upload: ${statistic.current}/${statistic.total}`, i.remoteDirPath);
        }catch (e){
            console.error(i.nativeDirPath,e);
        }finally {

            readStream.close();
        }
    }


}