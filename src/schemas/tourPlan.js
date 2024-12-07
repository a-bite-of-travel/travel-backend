const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const tourPlanSchema = new Schema({
    userId: mongoose.Types.ObjectId,
    startDate: Date,
    period: String,
    theme: String,
    contentid: [Object],
    title: String,
    createAt: { type: Date, default: Date.now },
    summary: String,
    thumbnail: String
}, { collection: 'tourPlan'});

module.exports = mongoose.model('TourPlan', tourPlanSchema);