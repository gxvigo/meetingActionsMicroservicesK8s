// set up ======================================================================
var express = require('express');
var app = express(); 						// create our app w/ express
var port = process.env.PORT || 8080; 				// set the port
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var proxy = require('http-proxy-middleware');

// configuration ===============================================================


// getting env variable to call the right URL for meetingApi
var meetingApiHost = process.env.MEETING_API_HOST || 'localhost'; 
var meetingApiPort = process.env.MEETING_API_PORT || 8090; 
var meetingApiUrl = 'http://' + meetingApiHost + ':' + meetingApiPort;
console.log("### meetinApiUrl: " + meetingApiUrl);
// proxy requests from Angular to meetingApi - this middleware goes before bodyParser otherwise doesn't work
app.use('/api', proxy({target: meetingApiUrl, changeOrigin: true}));


app.set('view engine', 'ejs');   // set the view engine to ejs
app.use(express.static('./public')); 		// set the static files location /public/img will be /img for users
app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.urlencoded({'extended': 'true'})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({type: 'application/vnd.api+json'})); // parse application/vnd.api+json as json
app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request


// use res.render to load up an ejs view file
// index page 
app.get('/', function(req, res) {
    res.render('pages/myindex');
});


// listen (start app with node server.js) ======================================
app.listen(port);
console.log("meetingUi listening on port " + port);
