const Validator = require("validator");
const isEmpty = require("./isEmpty")

module.exports = function validateRegisterInput(data) {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.password2 = !isEmpty(data.password2) ? data.password2 : "";

  if (!Validator.isLength(data.name,{min: 2, max: 30})){
    errors.name = "名字的长度在2到30为之间"
  }

  if (Validator.isEmpty(data.name)) {
    //这里的isEmpty方法时浏览器提供的
    errors.name = "名字不能为空"
  }

  if (Validator.isEmpty(data.email)) {
    //这里的isEmpty方法时浏览器提供的
    errors.email = "邮箱不能为空"
  }

  if (!Validator.isEmail(data.email)) {
    errors.email = "邮箱不合法"
  }

  if (Validator.isEmpty(data.password)) {
    //这里的isEmpty方法时浏览器提供的
    errors.password = "密码不能为空"
  }

  if (!Validator.isLength(data.password,{min: 6, max: 30})) {
    //这里的isEmpty方法时浏览器提供的
    errors.password = "密码的长度在6到30为之间"
  }

  if (Validator.isEmpty(data.password2)) {
    //这里的isEmpty方法时浏览器提供的
    errors.password2 = "确认密码不能为空"
  }

  if (!Validator.equals(data.password,data.password2)) {
    //这里的isEmpty方法时浏览器提供的
    errors.password2 = "两次输入密码不一致"
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}
