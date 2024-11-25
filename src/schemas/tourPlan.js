const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const tourPlanSchema = new Schema({
    userId: mongoose.Types.ObjectId,
    startDate: Date,
    period: String,
    theme: [Number],
    contentid: [String],
    title: String,
    createAt: { type: Date, default: Date.now },
    updateAt: Date
}, { collection: 'tourPlan'});

module.exports = mongoose.model('TourPlan', tourPlanSchema);