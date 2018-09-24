var express = require('express');
var router = express.Router();
const multer = require('multer');

const storage =  multer.diskStorage({
    destination: './files',
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    }
  });

const uploader = multer({storage});

router.post('/images', uploader.single('image'), (req, res, next) => {
const file = req.file;
const meta = req.body;
// デッバグのため、アップしたファイルの名前を表示する
console.log(file, meta);
// アップ完了したら200ステータスを送る
res.status(200).json({msg: 'アップロード完了'});
});

// publicディレクトリからhtmlをサーブする
router.use(express.static('public'));

module.exports = router;
