var express = require('express');
var router = express.Router();
const multer = require('multer');

const storage =  multer.diskStorage({
    destination: './files',
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    }
  });

const uploader = multer({storage: storage});

router.post('/', uploader.single('image'), (req, res, next) => {
  const file = req.file;
  const meta = req.body;
  console.log(file, meta);
  
  res.status(200).json({msg: 'アップロード完了'});
});

module.exports = router;
