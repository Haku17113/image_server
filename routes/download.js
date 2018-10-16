var express = require('express');
var router = express.Router();
var archiver = require('archiver');
var fs = require('fs');
var date_utils = require('date-utils');
var rmdir = require('rmdir')

router.get('/', (req, res, next) => {
  var zip_file_path = "./images.zip";
  var zip_file_name = 'images.zip';

  var uploader_dir_path = './uploaded_images/'
  var archive_dir_path = './images/';

  var selected_ago = [1, 3, 5, 7, 10, 20, 30, 40, 50, 60, 70, 80, 90]

  getFileList(archive_dir_path, (file) => {
    fs.unlink(file, (err) => {
      if(err){
        console.log(err.stack);
      }else{
        console.log('Removing file done.');
      }
    });
  });

  var now = new Date();
  console.log('now: ' + now.toFormat('YYYYMMDDHH24MI'));
  var selected_times = [];
  for(var i = 0; i < selected_ago.length; i++){
    var time = now.remove({'minutes': selected_ago[i]}).toFormat('YYYYMMDDHH24MI');
    selected_times.push(time);
    now.add({'minutes': selected_ago[i]});
  }
  console.log(selected_times);

  getFileList(uploader_dir_path, (file) => {
    for(var i = 0; i < selected_times.length; i++){
      if(file == uploader_dir_path + selected_times[i] + '.jpg'){
        cp(file, archive_dir_path + selected_times[i] + '.jpg');
        break;
      }
    }
  });

  var archive = archiver.create('zip', {});
  var output = fs.createWriteStream(zip_file_path);
  archive.pipe(output);
  archive.directory(archive_dir_path, 'images');

  output.on("close", () => {
      console.log('Archiving done. (archive size: ' + archive.pointer() + ' total bytes)');

      res.download(zip_file_path, zip_file_name, (err) => {
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
