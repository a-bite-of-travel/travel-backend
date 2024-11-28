const tourService = require('../services/tourService');

const getTourCodes = async (req, res) => {
    const data = await tourService.getTourCodes();

    res.status(200).json({message: 'ok', data});
}

// 여행 정보 생성하기
const getTourInfo = async (req, res) => {
    const {sigunguCode, startDate, period, theme} = req.body
    const data = await tourService.getTourInfo(sigunguCode, startDate, period, theme);

    res.status(201).json({message: 'ok', data });
}

// 여행정보 저장
const insertTourInfo = async (req, res) => {
    await tourService.insertTourInfo();

    res.status(201).json({message: 'ok', data: null});
}

// 여행 일정 저장
const insertTourPlan = async (req, res) => {
    await tourService.insertTourPlan(req.body);

    res.status(201).json({message: 'ok', data: null});
}


const getTourInfoList = async (req, res) => {
    const { contentType, page, region, cat, catValue,searchText } = req.query;
    const data = await tourService.getTourInfoList(contentType, page, region, cat, catValue,searchText);

    res.status(200).json({message: 'ok', data});
}

module.exports = {
    getTourCodes,
    getTourInfo,
    insertTourInfo,
    insertTourPlan,
    getTourInfoList
}