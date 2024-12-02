const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const tourInfoSchema = new Schema({
    addr: String,
    cat: String,
    contentid: String,
    contenttypeid: String,
    firstimage: String,
    firstimage2: String,
    mapx: String,
    mapy: String,
    tel: String,
    title: String,
    sigungucode: String,
    detailinfo: Object
}, {collection: 'tourInfo'});

module.exports = mongoose.model('TourInfo', tourInfoSchema);