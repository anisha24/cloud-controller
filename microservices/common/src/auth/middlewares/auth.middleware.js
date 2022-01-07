var jwt = require("jsonwebtoken");

const loginHelper = require('../helpers/login.helper')
var errorHandler = require("../../utils/error/error.status.code");

exports.auth = function(req, res, next){
    if(req.headers && req.headers.authorization && req.headers.authorization !== ""){
        let token = req.headers.authorization.split(" ")[1];
        loginHelper.validateToken(req).then(user => {
            let token = loginHelper.createToken(user);
            res.set('jwtToken', token);
            res.set('access-Control-Expose-Headers','*, jwtToken');
            next()
        }).catch(error => {
            console.log(error);
            responseObj = {
                status: 'error',
                msg: 'Either token is invalid or expired',
                body: errorHandler.errorHandler(401)
            };
            return res.status(401).send(responseObj)
        });
    }else{
        responseObj = {
            status: 'error',
            msg: 'Authentication token is missing',
            body: errorHandler.errorHandler(403)
        };
        return res.status(403).send(responseObj)
    }
        
}

module.exports.decodedUser = (req) => {
    let token = req.headers.authorization.split(' ')[1];
    let decodedToken = jwt.decode(token);
    return decodedToken.cecid;
}