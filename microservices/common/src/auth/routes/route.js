var express = require('express');
var loginController = require('../controller/login.controller');

var router = express.Router();
router.post('/login', loginController.login);
router.post('/logout', loginController.logout);
router.get('/token/validate', loginController.validateToken);
router.post('/token/:userId', loginController.invalidateToken);
module.exports = router;