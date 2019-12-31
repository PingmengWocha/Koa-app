const bcrypt = require("bcryptjs");
const tools = {
  enbcrypt(password){
    let salt = bcrypt.genSaltSync(10)
    let hash = bcrypt.hashSync(password,salt);
    return hash;
  }
}

module.exports = tools;
