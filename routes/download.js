var express = require('express');
var router = express.Router();
var archiver = require('archiver');
var fs = require('fs');
var rmdir = require('rmdir')

router.get('/', function (req, res, next) {
  var file_path = "./images.zip";
  var file_name = 'images.zip';

  var origin_path = './uploaded_images'
  var dir_path = './images';

  rmdir(dir_path , function ( err, dirs, files ){
    console.log('remove directory');
  });

  var archive = archiver.create('zip', {});
  var output = fs.createWriteStream(file_path);
  archive.pipe(output);
  archive.directory(origin_path, 'images');

  output.on("close", function(){
      var archive_size = archive.pointer() + " total bytes";
      console.log('\n' + archive_size + '\n');

      res.download(file_path, file_name, function(err){
       if(err){
          console.log('ERROR');
        }else{
          console.log('Download done');
        }
      });
  });

  archive.finalize();
});

function cp(origin, copy){
  fs.createReadStream(origin).pipe(fs.createWriteStream(copy));
}

module.exports = router;
