const mongoose = require('mongoose');
const { Schema } = require('mongoose');


const itinerarySchema = new Schema({
    destination: String,
    schedule: [Schema.Types.Mixed],
    itineraryName: String,
    departureDate: Date,
    userId: mongoose.Types.ObjectId,
    createdAt: { type: Date, default: Date.now },
    updatedAt: Date,
});

module.exports = mongoose.model('Itinerary', itinerarySchema);