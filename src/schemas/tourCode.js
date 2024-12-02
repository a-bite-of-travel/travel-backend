const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const tourCodeSchema = new Schema({
    code: String,
    name: String,
    type: String,
}, {collection: 'tourCode'});

module.exports = mongoose.model('TourCode', tourCodeSchema);