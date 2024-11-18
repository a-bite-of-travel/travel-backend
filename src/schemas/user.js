const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const userSchema = new Schema({
    email: String,
    password: String,
    profile_img: Buffer,
    nickName: String,
    joinedDate: { type: Date, default: Date.now },
    isDisabled: Boolean
});

module.exports = mongoose.model('User', userSchema);
