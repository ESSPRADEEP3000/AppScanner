const mongoose = require('mongoose');

const ScanResultSchema = new mongoose.Schema({
    url: String,
    vulnerabilities: Array,
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ScanResult', ScanResultSchema);
