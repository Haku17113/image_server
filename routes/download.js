var express = require('express');
var router = express.Router();
var archiver = require('archiver');
var fs = require('fs');

router.get('/', function (req, res, next) {
  var fileURL = "./images.zip";
  var fileName = 'images.zip';

  var archive = archiver.create('zip', {});
  var output = fs.createWriteStream(fileURL);
  archive.pipe(output);
  archive.directory('./images', 'images');

  output.on("close", function(){
      var archive_size = archive.pointer() + " total bytes";
      console.log('\n' + archive_size + '\n');

      res.download(fileURL, fileName, function(err){
       if(err){
          console.log('ERROR');
        }else{
          console.log('Download done');
        }
      });
  });

  archive.finalize();
});

module.exports = router;
