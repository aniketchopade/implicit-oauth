  var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var profileController = require('./controllers/profile');
var clientController = require('./controllers/client');
var authController = require('./controllers/auth');
var oauth2Controller = require('./controllers/oauth2');
var session = require('express-session');
var ejs = require('ejs');

// Connect to the beerlocker MongoDB
mongoose.connect('mongodb://localhost:27017/oauthdb');

// Create our Express application
var app = express();
app.set('view engine', 'ejs');
// Use the body-parser package in our application
app.use(bodyParser.urlencoded({
  extended: true
}));

// Use express session support since OAuth2orize requires it
//This is only need to be done after bodyParser middleware
app.use(session({
  secret: 'Super Secret Session Key',
  saveUninitialized: true,
  resave: true
}));

// Create our Express router
var router = express.Router();
app.use('/api', router);

// Create endpoint handlers for /users
router.route('/profiles')
  .post(profileController.postProfile)
  .get(authController.isAuthenticated, profileController.getProfile);

// Create endpoint handlers for /users
router.route('/clients')
  .post(clientController.postClients)

// Create endpoint handlers for oauth2 authorize
router.route('/oauth2/authorize')
  .get(authController.isAuthenticated, oauth2Controller.authorization)
  .post(authController.isAuthenticated, oauth2Controller.decision);

// Start the server
app.listen(4000);