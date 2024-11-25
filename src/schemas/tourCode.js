const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const tourCodeSchema = new Schema({
    code: Number,
    name: String,
    type: String,
    cond: [Object]
}, {collection: 'tourCode'});

module.exports = mongoose.model('TourCode', tourCodeSchema);