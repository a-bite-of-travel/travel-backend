const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const commentSchema = new Schema({
    content: String,
    userId: mongoose.Types.ObjectId,
    userName: String, // 작성자 닉네임 추가
    reviewId: mongoose.Types.ObjectId,
    createdAt: { type: Date, default: Date.now },
    updatedAt: Date,
    replies: [mongoose.Types.ObjectId]
});

module.exports = mongoose.model('Comment', commentSchema);