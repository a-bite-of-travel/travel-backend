const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const reviewSchema = new Schema({
    title: String,
    content: String,
    images: Buffer,
    userId: mongoose.Types.ObjectId,
    itineraryId: mongoose.Types.ObjectId,
    createdAt: { type: Date, default: Date.now },
    updatedAt: Date,
});

module.exports = mongoose.model('Review', reviewSchema);