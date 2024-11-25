const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const tourInfoSchema = new Schema({
    addr1: String, // 주소
    addr2: String, // 상세주소
    cat1: String, // 대분류
    cat2: String, // 중분류
    cat3: String, // 소분류
    contentid: String, // 콘텐츠ID
    contenttypeid: String, // 콘텐츠타입
    firstimage: String, // 원본이미지
    firstimage2: String, // 썸네일이미지
    mapx: String, // x좌표
    mapy: String, // y좌표
    tel: String, // 전화번호
    title: String, // 지명
    sigungucode: String
}, {collection: 'tourInfo'});

module.exports = mongoose.model('TourInfo', tourInfoSchema);