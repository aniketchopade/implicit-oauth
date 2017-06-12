// Load required packages
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

// Define our user schema
var ProfileSchema = new mongoose.Schema({
  profile: {
    type: String,
    unique: true,
    required: true
  },
    password: {
    type: String,
    required: true
  },
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  carclass: {
    type: String,
    required: true
  },

});

// Execute before each user.save() call
ProfileSchema.pre('save', function(callback) {
  var profile = this;

  // Break out if the password hasn't changed
  if (!profile.isModified('password')) return callback();

  // Password changed so we need to hash it
  bcrypt.genSalt(5, function(err, salt) {
    if (err) return callback(err);

    bcrypt.hash(profile.password, salt, null, function(err, hash) {
      if (err) return callback(err);
      profile.password = hash;
      callback();
    });
  });
});

ProfileSchema.methods.verifyPassword = function(password, cb) {
  bcrypt.compare(password, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

// Export the Mongoose model
module.exports = mongoose.model('Profile', ProfileSchema);