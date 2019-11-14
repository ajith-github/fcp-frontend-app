var express = require('express');
var router = express.Router();

let uploadController = require('../controllers/upload')

router.get('/', uploadController.uploader);

router.post('/', uploadController.create);

module.exports = router;
