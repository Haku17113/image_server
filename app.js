// var createError = require('http-errors');
// var express = require('express');
// var path = require('path');
// var cookieParser = require('cookie-parser');
// var logger = require('morgan');

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

// var app = express();

// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

// app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

// module.exports = app;


const express = require('express');
const multer = require('multer');

const app = express();

const storage =  multer.diskStorage({
  destination: './files',
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const uploader = multer({storage});

app.post('/images', uploader.single('image'), (req, res) => {
  const file = req.file;
  const meta = req.body;
  // デッバグのため、アップしたファイルの名前を表示する
  console.log(file, meta);
  // アップ完了したら200ステータスを送る
  res.status(200).json({msg: 'アップロード完了'});
});
// publicディレクトリからhtmlをサーブする
app.use(express.static('public'));

const port = 3000;
var server = require('http').createServer(app);
server.listen(port, function(req, res){
  console.log('http://localhost:' + port + '/\n');
});
