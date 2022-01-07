"use strict";
var loginHelper = require("../helpers/login.helper");
var errorHandler = require("../../utils/error/error.status.code");

let responseObj = {
  status: '',
  msg: '',
  body: null
};

/**
 @api {post} /login User Login
 @apiName login
 @apiGroup LOGIN

 @apiParam {String} username  USER username
 @apiParam {String[]} password  USER password

 @apiSuccessExample Success-Response:
 HTTP/1.1 200 OK
 {
    "token_type": "Bearer",
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmNTcyZDA2Ni1kODhiLTRlMTEtOGM1Ni1hMGY4ZDE1NTNlNGMiLCJuYW0iOiJhZG1pbiIsImlzcyI6IlltRndZekUxWXpBeU1ERTRibTkyTWpodWN6QjNNSEptYkRCMyIsInJvbCI6ImFkbWluLHdvcmtmbG93LWFkbWluIiwiZXhwIjoxNTI1ODY1NDQxMDAwLCJmbm0iOiJhZG1pbiIsImxubSI6ImFkbWluIiwiZW1sIjoiYWRtaW5AYml6YXBwcy5jaXNjby5jb20iLCJzaWQiOiI3ODI2ZTVkMC01MzU5LTExZTgtYWQwMC1jN2RiNDc0ZmExYzMiLCJpYXQiOjE1MjU4NjM2NDF9.8q-uKkSZvLMjkxLtgAXFCXqsnMtWVuhzXfIi81byQcs",
    "expires_in": 30,
    "auth-mode": "local"
  }
*/
exports.login = async function (req, res) {
  try {
    let response = await loginHelper.login(req);
    if (response) {
      return res.status(200).send(response);
    } else {
      responseObj = {
        status: 'error',
        msg: 'Invalid credentials',
        body: errorHandler.errorHandler(401)
      };
      return responseObj;
    }
  } catch {
    responseObj = {
      status: 'error',
      msg: 'Invalid credentials',
      body: errorHandler.errorHandler(401)
    };
    return responseObj;
  }
};

exports.logout = function (req, res) {
  loginHelper
    .logout(req)
    .then((data) => {
      return res.status(200).send(data);
    })
    .catch((error) => {
      return res.status(error.code).send(errorHandler.errorHandler(error.code));
    });
};

/**
 @api {get} /token/validate Validate user token
 @apiName validateToken
 @apiGroup validateToken

 @apiSuccessExample Success-Response:
 HTTP/1.1 200 OK
 {
    "status": true
 }

 @apiErrorExample Error-Response :
 {
    "info": "Unauthorized to access this API.",
    "status": false
 }
*/
module.exports.validateToken = async function (req, res) {

  try {
    return await loginHelper.validateToken(req);
  } catch (error) {
    return "Unauthorised to access this data";
  }
};

/**
 @api {post} /token/:userId
 @apiName invalidateToken
 @apiGroup LOGIN
 
 @apiParam {String} userId  USER id
*/
exports.invalidateToken = function (req, res) {
  loginHelper.invalidateToken(req.params.userId)
    .then((data) => {
      return res.status(200).json(data);
    })
    .catch((error) => {
      return res.status(error.code).send(errorHandler.errorHandler(500, []));
    });
};
