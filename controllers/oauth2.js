var oauth2orize = require('oauth2orize')

var Profile = require('../models/profile');
var Token = require('../models/token');
var Client = require('../models/client');

var server = oauth2orize.createServer();

//maps client --> client id
server.serializeClient( function(client, callback){
    return callback(null, client._id);
});

//maps client id ---> client
server.deserializeClient( function(id, callback){
    Client.findOne({_id: id}, function(err, client){
        if (err) return callback(err);
        return callback(null, client);
    })
})

// User authorization endpoint
exports.authorization = [
  server.authorization(function(clientId, redirectUri, callback) {
    console.log("authorizing "+ clientId);
    Client.findOne({ id: clientId }, function (err, client) {
      if (err) { return callback(err); }

      return callback(null, client, redirectUri);
    });
  }),
  function(req, res){
    console.log("my first render form here");
    res.render('dialog', { transactionID: req.oauth2.transactionID, profile: req.user, client: req.oauth2.client });
  }
]

// Register authorization code grant type
//implicit!
server.grant(oauth2orize.grant.token(function(client, profile, switc, urlparm, callback) {
  // Create a new authorization code
  console.log("in the grant")

  Token.findOne({ profile: profile._id }, function (err, token) {
    if (token) { 
      console.log("token found!, so do not create new one!");
      callback(null, token.value);
    }
    else {
        console.log("existing token not found!, so create one!")
        var token = new Token({
                  value: uid(256),
                  clientId: client._id,
                  redirectUri: urlparm.redirectURI,
                  profile: profile._id
          });
            console.log(JSON.stringify(token));
            token.save(function(err) {
              if (err) { return callback(err); }
              callback(null, token.value);
            });
    }
  });
}));



function uid (len) {
  var buf = []
    , chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    , charlen = chars.length;

  for (var i = 0; i < len; ++i) {
    buf.push(chars[getRandomInt(0, charlen - 1)]);
  }

  return buf.join('');
};

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Application client token exchange endpoint
exports.token = [
  server.token(),
  server.errorHandler()
]

// User decision endpoint
exports.decision = [
  server.decision()
]