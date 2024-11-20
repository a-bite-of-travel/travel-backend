const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const commentSchema = new Schema({
    content: String,
    userId: mongoose.Types.ObjectId,
    reviewId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review',
        required: true,
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: Date,
    replies: [mongoose.Types.ObjectId]
});

module.exports = mongoose.model('Comment', commentSchema);