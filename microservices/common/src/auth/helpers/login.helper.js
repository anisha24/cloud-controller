"use strict";
var jwt = require("jsonwebtoken");
const storage = require("node-persist");

var ldapauth = require("../config/ldap");

const secret = "cdtSecretString";
var expire = "3h";
var expireSecTime = 3600 * 1000;
let responseObj = {
  status: '',
  msg: '',
  body: null
};
storage.init({
  dir: "loginDB",
  stringify: JSON.stringify,
  parse: JSON.parse,
  encoding: "utf8",
  logging: false,
  ttl: expireSecTime,
  expiredInterval: 10 * 60 * 1000, //cleanup db after 10 min
});

module.exports.login = async function (req) {


  try {
    let user = await ldapauth.authenticateUser(req);

    if (user) {
      var timestamp = Date.parse(new Date().toUTCString());
      var token = jwt.sign({ cecid: user.cn, group: "admin", time: timestamp }, secret, { expiresIn: expire });
      req.session.username = user.cn;
      console.log("Logged in user ==>");
      console.log(req.session.username);
      responseObj = {
        status: 'success',
        msg: 'Successfully Authenticated User',
        body: {
          cn: user.cn,
          displayName: user.displayName,
          jwt: token
        }
      }
      return responseObj;
    } else {
      responseObj = {
        status: 'error',
        msg: 'Invalid credentials',
        body: null
      }
      return responseObj;
    }
  } catch (err) {
    responseObj = {
      status: 'error',
      msg: `LDAP Authenticated Failed: ${err}`,
      body: null
    }
    return responseObj;
  }
};

exports.logout = async function (input) {

  return new Promise(async (resolve, reject) => {
    let token = input.headers.authorization.split(" ")[1];
    let decodedToken = jwt.decode(token);
    try {
      let remTime = decodedToken.exp * 1000 - Date.parse(new Date().toUTCString());
      let inserted = await storage.setItem(token, "invalidToken", { ttl: remTime });
      return resolve("Logout Success");
    } catch (error) {
      return reject({ code: 403, err: error });
    }
  });
};

exports.validateToken = function (input) {
  return new Promise((resolve, reject) => {

    if (!input.headers.authorization || !input.headers.authorization.includes("Bearer ")) {
      return reject();
    }

    let token = input.headers.authorization.split(" ")[1];

    jwt.verify(token, secret, async function (err, tokendata) {
      if (err) {
        return reject({ code: 401, err: err });
      }

      if (tokendata) {

        let storedToken = await storage.getItem(token);

        if (storedToken) {
          return reject({ code: 401, err: "Logged Out" });
        } else {
          return resolve({ cecid: tokendata.cecid, group: tokendata.group });
        }
      }
    });
  });
};

exports.invalidateToken = function (input) {
  return new Promise(async (resolve, reject) => { });
};

const createToken = (user)=>{
  var timestamp = Date.parse(new Date().toUTCString());
  console.log(user.cn);
  return jwt.sign({ cecid: user.cn, group: "admin", time: timestamp }, secret, { expiresIn: expire });

}

module.exports.createToken = createToken;

function decodeRequest(input) {
  var str = input.headers.authorization;
  var op = atob(str.substring(5, str.length)).split(":");
  input["username"] = op[0];
  input["password"] = op[1];
  return input;
}
