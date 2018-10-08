var express = require('express');
var router = express.Router();

var status = 0;

router.get('/', (req, res, next) => {
  res.send(String(status));
  console.log('status:' + status);
  status = 0;
});

router.get('/call/', (req, res, next) => {
  status = 1;
  res.send(String(status));
  console.log('status:' + status);
});

module.exports = router;
