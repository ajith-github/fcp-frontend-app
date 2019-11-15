var express = require('express');
var router = express.Router();

let indexController = require('../controllers/index')

router.get('/', indexController.homepage);
router.get('/login', indexController.loginView);
router.get('/logout', indexController.logoutHandler);
router.get('/auth/google/callback', indexController.callbackHandler)
router.get('/google/login', indexController.googleURLHandler)

router.post('/login', indexController.loginHandler)
module.exports = router;
