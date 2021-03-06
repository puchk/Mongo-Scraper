// Dependencies
var express = require('express');
var bodyParser = require('body-parser');
var logger = require("morgan");
var mongoose = require('mongoose');
var exphs = require('express-handlebars');
// Scraping Tools
var request = require('request');
var cheerio = require('cheerio');

// Require Models
var Article = require('./models/Article.js');
var Note = require('./models/Note.js');

// Express
var app = express();
var port = process.env.PORT || 8080;

// Routes
var index = require('./routes/html-routes.js');

// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;

// Handlebars view engine
app.engine('handlebars', exphs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Morgan
app.use(logger('dev'));
// Body-parser
app.use(bodyParser.urlencoded({extended: false}));

// Serve static files in public dir
app.use(express.static("public"));

// Routes
app.use('/', index);

// MongoDB config
// mongoose.connect('mongodb://heroku_j7nm783q:9196rhr2b9cjgoulb1rvto6usn@ds163681.mlab.com:63681/heroku_j7nm783q');
mongoose.connect('mongodb://localhost/heroku_j7nm783q');
var db = mongoose.connection;

// Mongoose errors
db.on('error', function(error) {
	console.log('Mongoose error: ' + error);
});

// Success message when logged in
db.once('open', function() {
	console.log('Connected to Mongoose');
});



// Start Express
app.listen(port, function(err) {
  console.log('Listening on port ' + port);
});