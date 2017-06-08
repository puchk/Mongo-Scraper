// Require mongoose
var mongoose = require('mongoose');
// Schema class
var Schema = mongoose.Schema;

// Note schema
var NoteSchema = new Schema({
	title: {
		type: String
	},
	body: {
		type: String
	}
});

// Creates the Note model using the NoteSchema
var Note = mongoose.model("Note", NoteSchema);

module.exports = Note;