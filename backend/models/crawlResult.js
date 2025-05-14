// models/crawlResult.js
const mongoose = require('mongoose');

const xssResultSchema = new mongoose.Schema({
  fieldIndex: Number,
  payload:     String,
  detected:    Boolean
}, { _id: false });

const inputSchema = new mongoose.Schema({
  index:   Number,
  tag:     String,
  name:    String,
  snippet: String
}, { _id: false });

const crawlResultSchema = new mongoose.Schema({
  url:        { type: String, required: true },
  depth:      { type: Number, default: 0 },
  pages: [{
    url:       String,
    inputs:    [inputSchema],
    xssResults:[xssResultSchema]
  }],
  date:       { type: Date, default: Date.now }
});

module.exports = mongoose.model('CrawlResult', crawlResultSchema);
