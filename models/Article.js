// Require mongoose
var mongoose = require('mongoose');
// Schema class
var Schema = mongoose.Schema;

// Article schema
var ArticleSchema = new Schema({
	title: {
		type: String,
		required: true
	},
	link: {
		type: String,
		required: true
	},
	image: {
		type: String,
		required: true
	},
	saved: {
		type: Boolean,
		default: false
	},
	note: {
		// Only saves note's ObjectId
		type: Schema.Types.ObjectId,
		// Refers to Note model
		ref: "Note"
	}
});

// Creates the Article model using the ArticleSchema
var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;