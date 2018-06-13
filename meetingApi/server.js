// set up ======================================================================
var express = require('express');
var app = express(); 						// create our app w/ express
var mongoose = require('mongoose'); 				// mongoose for mongodb
var port = process.env.PORT || 8090; 				// set the port
var database = require('./config/database'); 			// load the database config
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

console.log("MeetingApi v011");

// configuration ===============================================================
// mongoose.connect(database.mongoUrl); 	// Connect to local MongoDB instance. 
var mongoUrl = 'mongodb://' + process.env.MONGO_HOST + ':' + process.env.MONGO_PORT + '/meetingactions';
console.log("### MONGO_HOST: " + process.env.MONGO_HOST);
console.log("### MONGO_PORT: " + process.env.MONGO_PORT);
console.log("### mongoUrl: " + mongoUrl);
mongoose.connect(mongoUrl); 	// Connect to local MongoDB instance. 

app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.urlencoded({'extended': 'true'})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({type: 'application/vnd.api+json'})); // parse application/vnd.api+json as json
app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request


// routes ======================================================================
require('./app/routes.js')(app);

// listen (start app with node server.js) ======================================
app.listen(port);
console.log("MeetingApi v011 listening on port " + port);
