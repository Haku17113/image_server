var express = require('express');
var router = express.Router();
var archiver = require('archiver');
var fs = require('fs');
var rmdir = require('rmdir')

router.get('/', (req, res, next) => {
  var file_path = "./images.zip";
  var file_name = 'images.zip';

  var origin_path = './uploaded_images/'
  var dir_path = './images/';

  getFileList(dir_path, (file) => {
    console.log(file);
    fs.unlink(file, (err) => {
      if(err){
        console.log(err.stack);
      }else{
        console.log('Removing files done.');
      }
    });
  });

  for(var i = 1; i <= 3; i++){
    cp(origin_path + 'sky' + i + '.jpg', dir_path + 'image' + i + '.jpg');
  }

  var archive = archiver.create('zip', {});
  var output = fs.createWriteStream(file_path);
  archive.pipe(output);
  archive.directory(origin_path, 'images');

  output.on("close", () => {
      console.log('Archiving done. (archive size: ' + archive.pointer() + ' total bytes)');

      res.download(file_path, file_name, (err) => {
       if(err){
          console.log(err.stack);
        }else{
          console.log('Downloading done.');
        }
      });
  });

  archive.finalize();
});

function cp(origin, copy){
  fs.copyFile(origin, copy, (err) => {
    if(err){
      console.log(err.stack);
    }else{
      console.log('Copying done.');
    }
  });
}

function getFileList(path, cb){
  fs.readdir(path, (err, files) => {
    if(err){
      console.log(err.stack);
    }else{
      console.log(files);
      if(cb){
        for(var i = 0; i < files.length; i++){
          cb.call(this, path + files[i]);
        }
      }
      return files;
    }
});
}

module.exports = router;
