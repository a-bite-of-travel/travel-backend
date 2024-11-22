const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const userSchema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profile_img: Buffer,
    nickName: String,
    joinedDate: { type: Date, default: Date.now },
    isDisabled: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null }
});

module.exports = mongoose.model('User', userSchema);
