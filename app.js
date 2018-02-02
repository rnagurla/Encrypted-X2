var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

//Connect to mongoose
mongoose.connect('mongodb://rohanrao35:fitracker@ds121588.mlab.com:21588/encryptedx2')
//mongoose.connect('mongodb://localhost/')
//mongodb://<dbuser>:<dbpassword>@ds121588.mlab.com:21588/encryptedx2
//mongoose.connect('mongodb://rohanrao35:fitracker1@ds129946.mlab.com:29946/fitracker');
var db = mongoose.connection;
User =require('./models/user');

app.get('/', function(req, res){
  res.send('Hello ');
});




app.listen(3000);


app.get('/users', function(req, res){

  User.getUsers(function(err, users){
      if(err){
        throw err;
      }
      res.json(users);
  });
});


module.exports = app;