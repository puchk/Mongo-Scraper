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
// var index = require('./routes/html-routes.js');

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
// app.use('/', index);

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

var index = require('./views/index.handlebars');
app.get('/', function(req, res) {
	res.render('index');
});

app.get("/scrape", function(req, res) {
  // First, we grab the body of the html with request
  request("http://www.fangraphs.com/blogs/", function(error, response, html) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(html);
    // Now, we grab every h2 within an article tag, and do the following:
    $(".post h2 a").each(function(i, element) {

      // Save an empty result object
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this).text();
      result.link = $(this).attr("href");

      // Using our Article model, create a new entry
      // This effectively passes the result object to the entry (and the title and link)
      var entry = new Article(result);

      // Now, save that entry to the db
      entry.save(function(err, doc) {
        // Log any errors
        if (err) {
          console.log(err);
        }
        // Or log the doc
        else {
          console.log(doc);
        }
      });

    });
  });
  // Tell the browser that we finished scraping the text
  res.send("Scrape Complete");
});

// This will get the articles we scraped from the mongoDB
app.get("/articles", function(req, res) {
  // Grab every doc in the Articles array
  Article.find({}, function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Or send the doc to the browser as a json object
    else {
      res.json(doc);
    }
  });
});

// Grab an article by it's ObjectId
app.get("/articles/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  Article.findOne({ "_id": req.params.id })
  // ..and populate all of the notes associated with it
  .populate("note")
  // now, execute our query
  .exec(function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Otherwise, send the doc to the browser as a json object
    else {
      res.json(doc);
    }
  });
});


// Create a new note or replace an existing note
app.post("/articles/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  var newNote = new Note(req.body);

  // And save the new note the db
  newNote.save(function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Otherwise
    else {
      // Use the article id to find and update it's note
      Article.findOneAndUpdate({ "_id": req.params.id }, { "note": doc._id })
      // Execute the above query
      .exec(function(err, doc) {
        // Log any errors
        if (err) {
          console.log(err);
        }
        else {
          // Or send the document to the browser
          res.send(doc);
        }
      });
    }
  });
});

// Start Express
app.listen(port, function(err) {
  console.log('Listening on port ' + port);
});