var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UserSchema = new Schema(
  {
    cecid: String,
    group: String,
  },
  { collection: "login-group" }
);

UserSchema.statics.lookupUsers = function (query, cb) {
  return User.findOne(query).exec(cb);
};

var User = mongoose.model("login-group", UserSchema);

module.exports = User;
