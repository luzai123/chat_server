var express = require('express');
var router = express.Router();
var WebSocket = require('ws').Server;

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('chat', { WebSocket: WebSocket });
});

module.exports = router;
