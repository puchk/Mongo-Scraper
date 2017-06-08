var express = require('express');
var router = express.Router();

// var index = require('../views/index.handlebars');

// var home = {
// 	title: 'Kevin Puchalski Portfolio'
// };

// Home
router.get('/', function(req, res) {
	// res.render('index', home );
	res.render('index');

});

module.exports = router;
