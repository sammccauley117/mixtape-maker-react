// Server
var express = require('express');
var cors    = require('cors');
var cookieParser = require('cookie-parser');
var bodyParser = require("body-parser")
var querystring  = require('querystring');
var request = require('request');

// Spotify API
var CLIENT_ID = 'CLIENT_ID'; // Client ID
var CLIENT_SECRET = 'CLIENT_SECRET'; // Secret
var STATE_KEY = 'spotify_auth_state';
var REDIRECT_URI = 'http://192.168.1.8:3001/callback';
var URL = 'http://192.168.1.8:3000';

// Random string function for Oath2
function randomString(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (var i = 0; i < length; i++)
   text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

// Express Server
// 1) Create and configure Express object
var app = express();
app.use(cors())
   .use(cookieParser())
   .use(bodyParser.json())
   .use(bodyParser.urlencoded({ extended: true }));

// 2) GET request for login
app.get('/login', function(req, res) {
  var state = randomString(16); // Create Oath2 key
  res.cookie(STATE_KEY, state); // Save key to cookies
  var scope = 'user-top-read user-read-private user-read-email playlist-modify-public'; // Spotify API scope
  // a) Send authorization request to Spotify
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: CLIENT_ID,
      scope: scope,
      redirect_uri: REDIRECT_URI,
      state: state,
      show_dialog: true
    }));
});

// 3) GET request from login callback--send the auth key to the user's browser
app.get('/callback', function(req, res) {
  // a) Variable initialization
  var code  = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[STATE_KEY] : null;

  // b) Check for callback error
  if (state===null || state!==storedState) res.redirect(URL+'/#'+querystring.stringify({error:'state_mismatch'}));
  else { // No callback error
    // c) Setup authorization options
    res.clearCookie(STATE_KEY);
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'))
      },
      json: true
    };

    // d) Send POST request to verify authorization
    request.post(authOptions, function(error, response, body) {
      // Authorization is valid! Pass the access token to the user's browser
      if (!error && response.statusCode === 200) {
        res.redirect(URL+'/#'+querystring.stringify({token: body.access_token}));
      }
      // Authorization is invalid. Pass this information along to the user's browser
      else {
        res.redirect(URL+'/#'+querystring.stringify({error:'invalid_token'}));
      }
    });
  }
});

// 4) Host the REST API
const server = app.listen(process.env.PORT || 3001, () => {
  const port = server.address().port;
  console.log(`App listening on port ${port}`);
});
