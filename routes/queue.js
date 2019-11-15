var express = require('express');
var router = express.Router();

let queueController = require('../controllers/queue')

router.post('/create', queueController.createHandler)
router.get('/list', queueController.listQueueHandler)

router.get('/messages', queueController.listMessageHandler)
router.post('/message', queueController.sendMessageHandler)
module.exports = router;
