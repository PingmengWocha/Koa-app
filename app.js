// (1) cnpm install koa koa-routes --save 安装koa和koa-router两个组件
const koa = require("koa");
const Router = require("koa-router");
// cnpm install mongoose --save来引入mongoose插件
const mongoose = require("mongoose");
//引入koa-bodyparser用户获取前端传来的数据
const bodyParser = require('koa-bodyparser');
//引入koa-passport 获取用户token
const passport = require("koa-passport");



//实例化koa
const app = new koa();
const router = new Router();

app.use(bodyParser());

//引入users.js
const users = require("./routes/api/users");

//路由
router.get("/",async ctx => {
  ctx.body = {msg: "Hello Koa Interfaces"}
})

//引入mongoURI
const db = require("./config/keys").mongoURI

//连接数据库
// mongoose.connect("mongodb+srv://deadmau5:<password>@cluster1-kejqo.mongodb.net/test")
mongoose.connect(db,{ useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Mongodb Connected...")
  })
  .catch(err => {
    console.log(err)
  })

//初始化koa-passport
app.use(passport.initialize());
app.use(passport.session());

//回调到config文件中，passport.js
require("./config/passport")(passport);

//配置路由地址
router.use("/api/users",users);


//配置路由
app.use(router.routes()).use(router.allowedMethods());

const port = process.env.POST || 5000;

app.listen(port, () => {
  console.log(`server started on ${port}`)
})


