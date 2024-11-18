const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const commentSchema = new Schema({
    content: String,
    userId: mongoose.Types.ObjectId,
    reviewId: mongoose.Types.ObjectId,
    createdAt: { type: Date, default: Date.now },
    updatedAt: Date,
    replies: [mongoose.Types.ObjectId]
});

module.exports = mongoose.model('Comment', commentSchema);