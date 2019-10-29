const fs = require('fs');
var timestamps = require('mongoose-timestamp');
var mongoose = require('mongoose');
var db = mongoose.connection;
mongoose.connect('mongodb://localhost:27017/socketChatDB', {useNewUrlParser: true});
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
var Schema = mongoose.Schema;
var sChatSchema = new Schema({
  message: String,
});
sChatSchema.plugin(timestamps);
var SChatModel = mongoose.model('SChatModel',sChatSchema );

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
//var indexRouter = require('./routes/index');

var app = express();
var server = require("http").createServer(app);
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({secret: "Shh, its a secret!"}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

server = app.listen(3000);
const io = require('socket.io')(server);

io.on("connection", (socket)=>{
  console.log("User Connected");
  
  //socket.username = 'unknown';
  socket.on('chat message', function(data){
    console.log('message: ' + data.message + data.user );
    fs.writeFile(path.join(__dirname, 'data/' + data.message + data.user + '.txt'), "Hello World!", function(err) {
      if(err) {
          return console.log(err);
      }
      console.log("The file was saved!");
  }); 
    socket.broadcast.emit("chat", {message:data.message, user:data.user});
    socket.emit("chat", {message:data.message, user:data.user});
    const pm = new SChatModel({message:data.message, user:data.user});
    pm.save();
  });
  socket.on('username',function(user){
    console.log('username: ' + user );
    //socket.username = user;
  } )
  socket.on("disconnect", ()=>{
  console.log("Disconnected")
})
});

app.get('/socket', function (req, res) {
  res.render('socket.ejs');
});
app.get('/usocket', function (req, res) {
  res.render('usocket.ejs');
});
app.get('/csocket', function (req, res) {
  res.render('csocket.ejs');
});

//app.use('/', indexRouter);

app.use(function(req, res, next) {
  next(createError(404));
});

