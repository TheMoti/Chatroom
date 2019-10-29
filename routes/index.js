var express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
var timestamps = require('mongoose-timestamp');
const _ = require('underscore');


var router = express.Router();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

var mongoose = require('mongoose');
var db = mongoose.connection;
mongoose.connect('mongodb://localhost:27017/chatDB', {useNewUrlParser: true});
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
var Schema = mongoose.Schema;
var ChatSchema = new Schema({
  message: String,
  user: String,
  id: String
});
ChatSchema.plugin(timestamps);
var ChatModel = mongoose.model('ChatModel',ChatSchema );

router.get('/', async function(req, res, next) {
  if (req.session.name) res.redirect("/chat");
  res.render('newUser.ejs');
});

router.post('/', urlencodedParser, function (req, res) {
  req.session.name = req.body.name;
  res.redirect("/chat");
});

router.get('/chat', async function(req, res, next) {
  if (!req.session.name) res.redirect("/");
  var log = [];
  var history = await ChatModel.find({}).limit(20);
  _.each(history, c=>{
    log.push(c.user + " : " + c.message + "\n");
  });
  log.reverse();
  res.render('index.ejs', { passage: log});
});
router.post('/chat', urlencodedParser, function (req, res) {
  if(/\S/.test(req.body.message)){
    const pm = new ChatModel({ message: req.body.message, user:req.session.name});
    pm.save();
  }
  res.redirect("/chat");
});

module.exports = router;
