var express = require('express');
var router = express.Router();

var status = 0;

router.get('/', function(req, res, next) {
  res.send(String(status));
  console.log(status);
  status = 0;
});

router.get('/call/', function(req, res, next) {
  status = 1;
  res.send(String(status));
  console.log(status);
});

module.exports = router;
