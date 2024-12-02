const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const reviewSchema = new Schema({
    title: String,
    content: String,
    imageUrl: [String],
    tags:[{ type: String }],
    status: { type: String, enum: ['ty1', 'ty2', 'ty3'], default: 'ty1' }, // 상태추가
    comments:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
    }],
    userId: mongoose.Types.ObjectId,
    itineraryId: mongoose.Types.ObjectId,
    createdAt: { type: Date, default: Date.now },
    updatedAt: Date,
});

module.exports = mongoose.model('Review', reviewSchema);