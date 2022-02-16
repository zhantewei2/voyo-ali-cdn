const path=require("path");
const join=(...args)=>path.join(__dirname,...args);
const {merge}=require("webpack-merge");




module.exports=({env})=>{
    const isBuild= env ==="production";
    const baseConfig={
      mode: "production",
      watch: !isBuild,
   
      target: "node",
      optimization: {
        minimize: false
      },
      output:{
        filename: "[name].js",
        library:{
          type:"commonjs"
        },
        clean: isBuild
      },
      module:{
        rules:[],
      },
      externals:[
        require("webpack-node-externals")(),
      ],
      resolve:{
        alias: {},
        extensions: [".ts",".js"]
      }
    }
    
    const copyPlugin=require("copy-webpack-plugin");
    
    return [
      merge(baseConfig,{

        entry:{
          "cdn": join("src/cdn/cdn.ts"),
        },
        output:{
          path: join("dist/cdn"),
        },
        module:{
          rules:[
            {
              test:/\.ts$/,
              use: [
                {
                  loader: "ts-loader",
                  options: {
                    context: __dirname,
                    configFile: join("project_pom/cdn/tsconfig.json")
                  }
                }
              ]
            }
          ]
        },
        plugins: [
          new copyPlugin({
            patterns:[
              {
                from: join("project_pom/cdn"),
                to: ""
              },
            ]
          })
        ]
      }),
      
      merge(baseConfig,{
        entry:{
          "oss": join("src/oss/oss.ts")
        },
        output:{
          path: join("dist/oss"),
        },
        module:{
          rules:[
            {
              test:/\.ts$/,
              use: [
                {
                  loader: "ts-loader",
                  options: {
                    context: __dirname,
                    configFile: join("project_pom/oss/tsconfig.json")
                  }
                }
              ]
            }
          ]
        },
        plugins: [
          new copyPlugin({
            patterns: [
              {
                from :join("project_pom/oss"),
                to: ""
              }
            ]
          })
        ]
      })
    ]
    
    
};