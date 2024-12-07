const tourInfoModel = require('../schemas/tourInfo');
const tourCodeModel = require('../schemas/tourCode');
const tourPlanModel = require('../schemas/tourPlan');

// 여행 일정 생성을 위해 필요한 코드 값 불러오기
const selectTourCodeList = async (cond) => {
    return await tourCodeModel.find(cond, { _id: 0 });
}

// 여행정보 저장
const saveTourInfo = async (data) => {
    await tourInfoModel.insertMany(data);
}

// 여행 상세 정보 저장
const updateTourInfo = async (cond, contentId) => {
    return await tourInfoModel.findOneAndUpdate(
        { contentid: contentId },
        cond,
        { new: true }
    );
}

// 여행지 정보 출력
const selectTourInfoList = async (cond, skip, limit) => {
    return await tourInfoModel.find(cond)
        .sort({title: 1})
        .skip(skip)
        .limit(limit);
}

// 여행지 상세 정보 출력
const findOneTourInfo = async (cond) => {
    return await tourInfoModel.findOne(cond);
}

const getTourInfoTotalCount = async (cond) => {
    return await tourInfoModel.countDocuments(cond);
}

// 여행 일정 저장
const insertTourPlan = async (data) => {
    const insertTourPlan = new tourPlanModel(data);
    return await insertTourPlan.save();
}

const getTourPlanTotalCount = async (cond) => {
    return await tourPlanModel.countDocuments(cond);
}

// 여행 계획 조회
const findByIdTourPlanList = async (id) => {
    return await tourPlanModel.find({userId: id});
}

const selectTourPlanDetail = async (id) => {
    return await tourPlanModel.findById(id);
}

module.exports = {
    selectTourCodeList,
    saveTourInfo,
    updateTourInfo,
    selectTourInfoList,
    findOneTourInfo,
    getTourInfoTotalCount,
    insertTourPlan,
    getTourPlanTotalCount,
    findByIdTourPlanList,
    selectTourPlanDetail
}