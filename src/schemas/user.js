const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const userSchema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileImage: { type: String, required: false },
    nickName: { type: String, required: true },
    joinedDate: { type: Date, default: Date.now },
    isDisabled: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null }
});

module.exports = mongoose.model('User', userSchema);
