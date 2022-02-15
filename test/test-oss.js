const {AliYoOSS} =require("../dist/oss/oss");
const path =require("path");

//
// const oss=new AliYoOSS({
//
// })
//
// oss.putDir(
//     "/test/dir"
//     ,path.join(__dirname,"dir"),
//     {
//         excludeRegs:[/\.html$/]
//     }
// )
// .then(result=>{
//     console.log(result);
// })