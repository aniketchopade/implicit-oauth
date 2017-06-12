var Profile = require('../models/profile');

// Create endpoint /api/users for POST
exports.postProfile = function(req, res) {
  var profile = new Profile({
    profile: req.body.profile,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    password: req.body.password,
    email: req.body.email,
    carclass: req.body.carclass
  });

  profile.save(function(err) {
    if (err)
      res.send(err);

    res.json({ message: 'New profle added to the database!' });
  });
};

// Create endpoint /api/users for GET
exports.getProfile = function(req, res) {
  Profile.find(function(err, profile) {
    if (err)
      res.send(err);

    res.json(profile);
  });
};