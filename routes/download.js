var express = require('express');
var router = express.Router();
var archiver = require('archiver');
var fs = require('fs');
var data_utils = require('date-utils');

router.get('/', function (req, res, next) {
  var extension = '.jpg';

  var fileURL = './files/sky1' + extension;
  var fileName = 'image' + extension;

  res.download(fileURL, fileName, function(err){
    if(err){
      console.log('ERROR');
    }else{
      console.log('Download done');
    }
  });
});

module.exports = router;
