var mongoose = require("mongoose");

var UserSchema = new mongoose.Schema({

  firstName: String,
	lastName: String,
  email: String,
  password: String,
  accessKey: Number,
  securityQuestion: String,
  securityAnswer: String,
  files: Array,
  sharedWithMe: Array,
  sharingFiles: Array,
  /////////////ADDED
  shareRequests: Array
  ///////////////////
});



const UserModel = mongoose.model('User', UserSchema);
  module.exports = UserModel;

  module.exports.getUsers = (callback) => {
	User.find(callback);
}


module.exports.removeUser = (_email, callback) => {

  var query = { email: _email };
  console.log(query);
  User.remove(query, callback);

}
module.exports.addUser = (user, callback) => {
	User.create(user, callback);
}
