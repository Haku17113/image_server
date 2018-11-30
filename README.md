# ImageServer

## Overview
画像のアップロード及びアップロードされた画像のダウンロードが可能なサーバ

## Description
Node.js 6.41及びExpress 4.16.0を用いて作成した。
そのため、使用言語はJavaScriptである。
画像のアップロードは、指定のURLへ画像をPOSTされるとuploaded_imagesに画像を保存する。
ダウンロードは、指定したURLへアクセスされるとuploaded_images内の画像を圧縮し、zipファイルとしてダウンロードさせる。

## Setup
Node.jsをインストールし、npmコマンドが使える状態にする。
リポジトリをクローンし、image_serverフォルダ内に移動
```
git clone https://github.com/Haku17113/image_server.git
cd image_server
```
各モジュールのインストール
```
npm install --save
```
サーバの起動
```
npm run start
```
Webブラウザで http://localhost:3000/ を開く

## Usage
<!-- ![http://localhost:3000/の画像](https://github.com/Haku17113/image_server/issues/1#issue-380073349) -->

- 画像のアップロード: ファイルを選択ボタンを押し、画像を選択した後にUploadボタンを押す。

- 画像のダウンロード: Downloadボタンを押す。アップロードした画像を圧縮したzipファイルがダウンロードされる。

## 各フォルダの説明
- bin:
npm run start によって実行されるファイルであるwwwが置かれている。

- node_modules:
Expressなどの各モジュールが置かれている。

- public:
viewのためのCSSファイルが置かれている。

- routes:
機能を実現するコード(JavaScript)が置かれている。

- uploaded_images:
アップロードされた画像が保存される。

- views:
ブラウザで表示される部分のコード(Jade)が置かれている。

## 各ファイルの説明
### app.js
一部抜粋
```javascript
// 各ファイルをモジュールとして宣言
var indexRouter = require('./routes/index');
var uploadRouter = require('./routes/upload');
var downloadRouter = require('./routes/download');
var statusRouter = require('./routes/status');

app.use('/', indexRouter);
app.use('/upload', uploadRouter);
app.use('/download', downloadRouter);
app.use('/status', statusRouter);
```
app.use('URLの後', モジュール)となっており、指定したURLにアクセスされると各ファイルを呼び出す。<br>
http://localhost:3000/ にアクセスされた場合URLの後が'/'であるため、routes/index.jsファイルを呼び出す。http://localhost:3000/download  の場合routes/download.jsファイルを呼び出す。

### routes/index.js
一部抜粋
```javascript
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Image Server' });
});
```
titleという変数に'Image Server'を代入し、views/index.jadeをレスポンスとして返している。

### views/index.jade
```jade
extends layout //- layout.jadeを継承

block content //- 継承したlayout.jadeの部分に追加
  h1= title
  p Welcome to #{title}<br> //- titleは変数
  p <br>画像のアップロード
  //- ボタンが押されると選択された画像をhttp://localhost:3000/uploadにPOST送信する
  form(action='/upload', method='post', enctype='multipart/form-data')
    input(type='file', name='image') // POST送信する画像のラベルをnameに設定
    input(type='submit', value='Upload')

  p <br>画像のダウンロード
  //- ボタンが押されるとhttp://localhost:3000/downloadにGET送信（アクセス）する
  form(action='/download', method='get')
    input(type='submit', value='Download')
```

### views/layout.jade
```jade
doctype html
html
  head
    title= title //- タイトルにtitle変数を設定
    link(rel='stylesheet', href='/stylesheets/style.css')
  body
    block content //- layout.jadeを継承したファイルが利用する
```

### routes/download.js
一部抜粋
```javascript
router.get('/', (req, res, next) => {
  var archive = archiver.create('zip', {});
  var output = fs.createWriteStream("./images.zip"); // 作成する圧縮ファイルのパスを指定
  archive.pipe(output);
  archive.directory('./uploaded_images/', 'images'); // 第一引数に圧縮対象フォルダ（ディレクトリ）のパス、第二引数に解凍後のフォルダ名を指定

  archive.finalize(); // 圧縮を実行

  output.on("close", () => {
    // archive.finalize()での圧縮が終わると実行される
    console.log('Archiving done. (archive size: ' + archive.pointer() + ' total bytes)');

    res.download("./images.zip", 'images.zip', (err) => {
      if(err){
        console.log(err.stack);
      }else{
        console.log('Downloading done.');
      }
    });
  });
});
```
http://localhost:3000/download/ にアクセスされると、router.getで宣言されている関数が実行される。<br>
res.download で第一引数にダウンロードさせるファイルのパス、第二引数にダウンロードファイルの名前を設定する。<br>
http://localhost:3000/download/ にアクセスされると、images.zipという圧縮ファイルをダウンロードさせる。images.zipを解凍するとimagesというフォルダが現れる。imagesフォルダ内には、アップロードした画像が置かれている。

### routes/upload.js
一部抜粋
```javascript
const storage =  multer.diskStorage({
    destination: './uploaded_images', //　保存するフォルダを指定
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    }
  });

const uploader = multer({storage: storage});

router.post('/', uploader.single('image'), (req, res, next) => {
  const file = req.file;
  const meta = req.body;
  console.log('Uploading done.');
  console.log(file, meta);
  
  res.status(200).json({msg: 'アップロード完了'});
});
```
http://localhost:3000/upload/ にPOSTリクエストがあると、router.postで宣言されている関数が実行される。<br>
uploader.single()で受け取るラベルの設定をする。views/index.jadeでformのinputでname
に設定したものと同じもの（'image'）にする。
