const path=require("path");
const join=(...args)=>path.join(__dirname,...args);
const {merge}=require("webpack-merge");




module.exports=({env})=>{
    const baseConfig={
      mode: "production",
      watch: env==="development",
   
      target: "node",
      optimization: {
        minimize: false
      },
      output:{
        filename: "[name].js",
        library: "commonjs",
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
      },
      plugins: [
        new (require("copy-webpack-plugin"))({
          patterns:[
            {
              from: join("project_pom/cdn.package.json"),
              to: ""
            }
          ]
        })
      ]
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
                    configFile: join("project_pom/cdn.tsconfig.json")
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
                from: join("project_pom/oss.package.json"),
                to: "package.json"
              }
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
                    configFile: join("project_pom/oss.tsconfig.json")
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
                from :join("project_pom/oss.package.json"),
                to: "package.json"
              }
            ]
          })
        ]
      })
    ]
    
    
};