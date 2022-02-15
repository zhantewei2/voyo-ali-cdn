const path=require("path");
const join=(...args)=>path.join(__dirname,...args);

module.exports=({env})=>({
  mode: "production",
  watch: env==="development",
  entry:{
    "cdn":join("src/cdn.ts")
  },
  target: "node",
  optimization: {
    minimize: false
  },
  output:{
    path: join("dist"),
    filename: "[name].js",
    library: {
      type:"commonjs"
    },
  },
  module:{
    rules:[
      {
        test: /\.ts$/,
        use:["ts-loader"]
      }
    ],
  },
  externals:[
    require("webpack-node-externals")(),
  ],
  resolve:{
    alias: {},
    extensions: [".ts",".js"]
  },
  plugins: []
});