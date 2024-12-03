const express = require('express');
const tourController = require('../controllers/tourController');

const route = express.Router();

route.post('/data', tourController.saveTourInfo); // 여행정보 데이터베이스에 저장
route.post('/', tourController.getTourPlanData); // 여행 일정 정보 불러오기
route.get('/code', tourController.getTourCodes); // 여행 일정 생성에 필요한 코드 가져오기
route.post('/plan', tourController.insertTourPlan); // 여행일정 저장
route.get('/info', tourController.getTourInfoList); // 여행정보 목록 가져오기
route.get('/info/:contentid', tourController.getTourInfoDetail);

module.exports = route;