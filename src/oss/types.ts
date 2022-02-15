import {ReadStream} from "fs";

export interface AliYoOssCtor{
    region:string;
    accessKeyId:string;
    accessKeySecret:string;
    bucket:string;
}
export type AliOSS=any;
export type MetaRecord =Record<string, string>;
export type HttpHeaders =Record<string, string>;
export type PathType = string;
export type PutFileType= PathType|Buffer|ReadStream;

export interface PutOpts{
    timeout?:number;
    mime?:string;
    meta?: MetaRecord;
    headers?: HttpHeaders;
    disabledMD5?:boolean;
    callback?: ()=>void;
}

export type PutResult={
    name:string;
    url:string;
    res: {
        status: number;
        headers: HttpHeaders;
        size: number;
        rt: number;
    }
}

export interface PutDirOpts{
    putOpts?:PutOpts;
    excludeRegs?: RegExp[]; //ignore regexp matched.
}