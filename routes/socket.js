var express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
var timestamps = require('mongoose-timestamp');
const _ = require('underscore');
const {io} = require('../app.js');
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

io.on('connection', function (socket) {
    
});

ChatSchema.plugin(timestamps);
var ChatModel = mongoose.model('ChatModel',ChatSchema );




module.exports = router;
