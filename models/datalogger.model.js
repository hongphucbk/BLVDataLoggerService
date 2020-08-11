var mongoose = require('mongoose');
var dataloggerSchema = new mongoose.Schema({
	machine: String,
	CO: String,
	length: Number,
	qty: Number,
	qdone: Number,
	markprint: String,
	instruction: String,
	user: String,
	qty1: Number,
	interval: String,
	created_at: Date,
});

var DataLogger = mongoose.model('DataLogger', dataloggerSchema, 'datalogger');

module.exports = DataLogger;