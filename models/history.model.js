var mongoose = require('mongoose');
var historySchema = new mongoose.Schema({
	machine: String,
	CO: String,
	length: Number,
	qty: Number,
	qdone: Number,
	markprint: String,
	instruction: String,
	user: String,
	qty1: Number,
	isSuccessReported: Number,
	interval: String,
	created_at: Date,
});

var History = mongoose.model('History', historySchema, 'history');

module.exports = History;