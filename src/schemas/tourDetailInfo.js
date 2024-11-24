const mongoos = require('mongoose');
const { Schema } = require('mongoose');

const tourDetailInfoSchema = new Schema({
    contentid: String, // 콘텐츠ID
    hmpg: [String], // 홈페이지 주소
    overview: String, // 개요
    contenttypeid: String,
    restdate: String, //쉬는날
    opentime: String, //영업시간
    usetime: String, // 이용시간
    parking: String, // 주차시설
    parkingfee: String, // 주차요금
    infocenter: String, //문의및안내
    accomcount: String, // 수용인원
    usefee: String, // 이용요금
    reservation: String, // 예약안내
    etc: Object
},{collection: 'tourDetailInfo'});

module.exports = mongoos.model('TourDetailInfo', tourDetailInfoSchema);