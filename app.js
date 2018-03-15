var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var randomstring = require("randomstring");
//<<<<<<< HEAD
//var passport = require('passport');
//var passport = require('./config/passport.js');
//=======
var AWS = require('aws-sdk');
//>>>>>>> 390935765f672cc5a6b242ebf5ae3d566cda7ca1
app.use(bodyParser.json());
//var filepath = require('filepath');
//var cloud = require('./test_bucket.js');
//Connect to mongoose
//user for mlab: rohanrao35
//pass for mlab: password1234
const bcrypt = require('bcrypt');
//var ObjectId = require('mongodb').ObjectID;
mongoose.connect('mongodb://rohanrao35:fitracker@ds121588.mlab.com:21588/encryptedx2');
//mongoose.connect('mongodb://localhost/')
//mongodb://<dbuser>:<dbpassword>@ds121588.mlab.com:21588/encryptedx2
//mongoose.connect('mongodb://rohanrao35:fitracker1@ds129946.mlab.com:29946/fitracker');

//mongoose.connect('mongodb://rohanrao35:fitracker@ds129946.mlab.com:29946/fitracker')



var db = mongoose.connection;
User =require('./models/user');
Files =require('./models/file');

app.get('/', function(req, res){
  res.send('Hello ');
});



app.listen(3000);

/* Google Code */
/*
app.get('/auth/google',
  passport.authenticate('google', { scope:
  	[ 'https://www.googleapis.com/auth/plus.login',
  	, 'https://www.googleapis.com/auth/plus.profile.emails.read' ] }
));

app.get( '/auth/google/callback',
    passport.authenticate( 'google', {
    function(req, res) {
        res.redirect('http://localhost:3000/'); // Link to go whne log in is successfull.
      }
}));
*/
/* Google Code */

app.get('/users', function(req, res){
  //var path = filepath.create('jsmn.gcda');
  console.log(path);
  User.getUsers(function(err, users){
      if(err){
        throw err;
      }
      res.json(users);
  });
});


app.post('/createaccount', (req, res) => {

  var collection = db.collection('users');
  var _email = req.body.email;

  collection.find({email: req.body.email}).toArray(function (err, items) {

   var user = items[0];

   if (err) {
    return res.status(500).json({message: "Internal Server Error"});
  }

   if (user) {
     console.log('User already exists');
     return res.status(401).json({message: "User already exists"});
   }

   else  {
      var user = req.body;
      user.password = bcrypt.hashSync(req.body.password, req.body.password.length);

      console.log(user);

      User.addUser(user, (err, user) => {
        if(err){
          throw err;
        }
        return res.status(200).json({message: "Success"});
        //res.json(user);
      });
   }
 });

});

app.post('/editaccount', (req, res) => {

  var collection = db.collection('users');

    collection.find({email: req.body.email}).toArray(function (err, items) {
    var user = items[0];
    console.log(user);
    console.log(user.password);
    user.password = bcrypt.hashSync(req.body.password, req.body.password.length);
    console.log(user.password);
    collection.updateOne({email: req.body.email}, {$set:{password: user.password}});

    return res.status(200).json({message: "Success"});
  });

});







app.delete('/api/users/:_email', (req, res) => {
	var _email = req.params._email;
  //id = "5a7a4e9c52e1bf1e8c1c4076";
	User.removeUser(_email, (err, user) => {
		if(err){
			throw err;
		}
		res.json(user);
	});
});






app.post('/login/', function(req, res){
  //console.log(req.body.email);

  var collection = db.collection('users');
  var _email = req.body.email;
  var first;

   //collection.find({password: req.body.password}).toArray(function (err, items) {
   collection.find({email: req.body.email}).toArray(function (err, items) {

       var user = items[0];

       if(!user){
         console.log('No user');
         return res.status(401).json({message: "User does not exit"});
       }

      else if(bcrypt.compareSync(req.body.password, user.password)) {
        console.log('Passwords match');
        return res.status(200).json({message: "Success"});

      }
      else if (!bcrypt.compareSync(req.body.password, user.password)){
      //
         console.log('Wrong password');
         return res.status(401).json({message: "Invalid credentials"});
      }

 	});

});



/////////////////////////FILES///////////////////////////



app.get('/files', function(req, res){

  Files.getFiles(function(err, files){
      if(err){
        throw err;
      }
      res.json(files);
  });
});


//
///////////////////////////////////ADDED
app.post('/shareRequest', function(req, res){
  //console.log(req.body.email);

  //Need to pass the url of the file to share and the email address of the person to share with
  var shareTo = req.body.shareTo;


  var collection = db.collection('users');
  collection.find({email: shareTo}).toArray(function (err, items2) {
    var user = items2[0];
    var len2 = user.sharedWithMe.length;
    if(user){
     // collection2.updateOne({email: shareTo}, {$set:{sharedWithMe.$[len2]: req.body.url}});
     collection.updateOne({email: shareTo},  { $push: { sharedRequests: req.body.url} });
     return res.status(200).json({message: "Success"});

    }
    else{
      ////return error
      return res.status(401).json({message: "No user"});

    }
  });
});

/////////////////////////////////////////////
app.post('/shareAccept', function(req, res){
  //console.log(req.body.email);

  //Need to pass the url of the file to share and the email address of the person to share with


  var shareTo = req.body.shareTo;

  var collection = db.collection('files');
  var collection2 = db.collection('users');

   collection.find({link: req.body.url}).toArray(function (err, items) {

     var file = items[0];
     var len = file.usersShared.length;
     if(file){
       collection.updateOne({link: req.body.url}, { $push: { usersShared: shareTo} });
       // collection.updateOne({link: req.body.url}, {$set:{usersShared[len]: shareTo}});
     }
     else{
       ////return error
       return res.status(401).json({message: "No file"});

     }
     collection2.find({email: shareTo}).toArray(function (err, items2) {
       var user = items2[0];
       var len2 = user.sharedWithMe.length;
       if(user){
        // collection2.updateOne({email: shareTo}, {$set:{sharedWithMe.$[len2]: req.body.url}});
        collection2.updateOne({email: shareTo},  { $push: { sharedWithMe: req.body.url} });
/////////////////////////////ADDED
        var _link = req.body.url;
        Files.removeFileRequest(_link, (err, _link) => {
      		if(err){
      			throw err;
      		}
      		//res.json(_link);
          return res.status(200).json({message: "Success"});
      	});
        //sreturn res.status(200).json({message: "Success"});
///////////////////////////////////////
       }
       else{
         ////return error
         return res.status(401).json({message: "No user"});

       }
     });
 	 });

});


///////////////////////////////ADDED
app.post('/shareDeny', function(req, res){
  //console.log(req.body.email);

  //Need to pass the url of the file to share and the email address of the person to share with
  collection.find({email: shareTo}).toArray(function (err, items) {
    var user = items[0];
    var len = user.sharedWithMe.length;
    if(user){
      var _link = req.body.url;
     Files.removeFileRequest(_link, (err, _link) => {
       if(err){
         throw err;
       }
       return res.status(200).json({message: "Success"});
     });

    }
    else{
      ////return error
      return res.status(401).json({message: "No user"});
    }
  });
});
///////////////////////////////

app.delete('/api/files', (req, res) => {
	var _link = req.body._link;
  //id = "5a7a4e9c52e1bf1e8c1c4076";
	Files.removeFile(_link, (err, _link) => {
		if(err){
			throw err;
		}
		res.json(_link);
	});
});



app.post('/addfile', (req, res) => {

  var file = req.body;
  var encryptor = require('file-encryptor');
  var key = 'Encrypted';



  var Cryptr = require('cryptr'),
    cryptr = new Cryptr('myTotalySecretKey');


var encryptedString = cryptr.encrypt(req.body.data);
//var decryptedString = cryptr.decrypt(encryptedString);

console.log(req.body.data);
console.log(encryptedString);  // e74d7c0de21e72aaffc8f2eef2bdb7c1
//console.log(decryptedString);


  var a = 'AKIAJIWL4ZC';
  var b = '3S26DRGPQ';
  var c = 'GRna0iPyNPBG5FTsIOUeD';
  var d = 'CsmkVQ8A1q2oL+RWddc';
  var ab = a + b;
  var cd = c + d;
  AWS.config.update({ accessKeyId: ab, secretAccessKey: cd });

  var base64data = new Buffer(encryptedString, 'binary');
  var s3 = new AWS.S3();
  https://s3.amazonaws.com/encryptedx2_content/test2.txt
  var rand = randomstring.generate(7);
  file.link = 'https://s3.amazonaws.com/encryptedx2_content/' + rand;
    s3.putObject({
    Bucket: 'encryptedx2_content',
    Key: rand,
    Body: base64data,
          ACL: 'public-read'
    },function (resp) {
      console.log(arguments);
      console.log('Successfully uploaded package.');
    });
	Files.addFile(file, (err, file) => {
		if(err){
			throw err;
		}
		//res.json(file);
    return res.status(200).json({link: file.link});
	});

//  return res.status(200).json({link: file.link});

});


function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}







// Decrypt file.
//encryptor.decryptFile('encrypted.dat', 'output_file.txt', key, function(err) {
  // Decryption complete.
//});


module.exports = app;
