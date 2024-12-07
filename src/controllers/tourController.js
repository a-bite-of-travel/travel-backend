const tourService = require('../services/tourService');

const getTourCodes = async (req, res) => {
    const data = await tourService.getTourCodes();

    res.status(200).json({message: 'ok', data});
}

// 여행 정보 생성하기
const getTourPlanData = async (req, res) => {
    const {sigunguCode, startDate, period, theme} = req.body

    const data = await tourService.getTourPlanData(sigunguCode, startDate, period, theme);

    res.status(201).json({message: 'ok', data });
}

// 여행정보 저장
const saveTourInfo = async (req, res) => {
    await tourService.saveTourInfo();

    res.status(201).json({message: 'ok', data: null});
}

// 여행 일정 저장
const insertTourPlan = async (req, res) => {
    await tourService.insertTourPlan(req.body);

    res.status(201).json({message: 'ok', data: null});
}


const getTourInfoList = async (req, res) => {
    const { contenttypeid, page, region, cat, catValue,searchText } = req.query;
    const data = await tourService.getTourInfoList(contenttypeid, page, region, cat, catValue,searchText);

    res.status(200).json({message: 'ok', data});
}

const getTourInfoDetail = async (req, res) => {
    const { contentid } = req.params;
    const { contenttypeid } = req.query;

    const data = await tourService.getTourInfoDetail(contentid, contenttypeid);

    res.status(200).json({message: '상세페이지 조회 성공', data});
}

const showTourInfoDetailWithKaKao = async (req, res) => {
    const x = req.query.x;
    const y = req.query.y;
    const title = req.query.title;
    const data = await tourService.showTourInfoDetailWithKaKao(x, y, title);

    res.status(200).json({message: '상세 여행 정보 조회 성공', data});
}

const findByIdTourPlanList = async(req, res) => {
    const { id } = req.params;

    const data = await tourService.findByIdTourPlanList(id);

    res.status(200).json({message: '여행 일정 목록 조회 성공', data});
}

const selectTourPlanDetail = async (req, res) => {
    const { id } = req.params;
    console.log('id>>>>>>>>>>>>>>>>>>>>>> ', id);
    const data = await tourService.selectTourPlanDetail(id);

    res.status(200).json({message: '상세 여행 일정 조회 성공', data});
}

module.exports = {
    getTourCodes,
    getTourPlanData,
    saveTourInfo,
    insertTourPlan,
    getTourInfoList,
    getTourInfoDetail,
    showTourInfoDetailWithKaKao,
    findByIdTourPlanList,
    selectTourPlanDetail
}