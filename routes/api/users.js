const Router = require("koa-router");
const router = new Router();
const tools = require("../../config/tools");
//引入jsonwebtoken用于生成token
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
//引入passport
const passport = require("koa-passport");

//引入User
const User = require("../../models/Users");
//引入验证
const validateRegisterInput = require("../../validation/register")
const validateLoginInput = require("../../validation/login")
//引入bcrypt 用于加密密码
const bcrypt = require("bcryptjs");

/**
 * @route GET api/users/test
 * @desc 测试接口地址
 * @access 公开的接口
 */
router.get("/test", async ctx => {
  ctx.status = 200;
  ctx.body = {msg: "users works..."}
})

/**
 * @route POST api/users/register
 * @desc 注册接口地址
 * @access 公开的接口
 */
router.post("/register",async ctx => {
  // console.log(ctx.request.body)

  const { errors, isValid } = validateRegisterInput(ctx.request.body);

  //判断是否验证通过
  if (!isValid){
    ctx.status = 400;
    ctx.body = errors;
    return;
  }

  //将前端传来的数据存入数据库
  const findResult = await User.find({email: ctx.request.body.email});
  if (findResult.length > 0){
    ctx.status = 500;
    ctx.body = {"email": "邮箱已被占用"};
  }else {
    const newUser = new User({
      name: ctx.request.body.name,
      email: ctx.request.body.email,
      password: tools.enbcrypt(ctx.request.body.password)
    });

    //存储到数据库
    await newUser.save().then(user => {
      //返回json数据
      ctx.body = user;
    }).catch(err => {
      console.log(err)
    });
  }
})

/**
 * @route POST api/users/login
 * @desc 登录接口地址 返回token
 * @access 公开的接口
 */
router.post("/login",async ctx => {

  const { errors, isValid } = validateLoginInput(ctx.request.body);

  //判断是否验证通过
  if (!isValid){
    ctx.status = 400;
    ctx.body = errors;
    return;
  }

  //查询
  const findResult = await User.find({email: ctx.request.body.email});
  if (findResult.length == 0){
    ctx.status = 404
    ctx.body = {email: "用户不存在"};
  } else {
    //查到后验证密码
    let result = bcrypt.compareSync(ctx.request.body.password, findResult[0].password);
    if (result){
      const payload = { id: findResult[0].id, name: findResult[0].name, avatar: findResult[0].avatar };
      const token = jwt.sign(payload,keys.secretOrKey,{expiresIn: 3600});


      ctx.status = 200;
      //返回的token的格式是一定的，必是"Bearer "开头
      ctx.body = {success: true, token: "Bearer " + token};
    }else {
      ctx.status = 400;
      ctx.body = {password: "密码错误！"};
    }
  }
})

/**
 * @route GET api/users/current
 * @desc 用户信息接口地址 返回用户信息
 * @access 私有的接口
 */
router.get("/current", passport.authenticate('jwt', { session: false }),async ctx => {
  ctx.body = {
    id: ctx.state.user.id,
    name: ctx.state.user.name,
    email: ctx.state.user.email,
    avatar: ctx.state.user.avatar
  };
});

module.exports = router.routes();
