const { tourApi, gptAI } = require('../utils/api');
const tourModel = require('../models/tourModel');

const returnTourInfoMap = (data, type) => {
    return data.map(item => {
        let cat = '';

        if(type === 'food')
            cat = item.cat3;
        else
            cat = item.cat2;

        return {
            addr: item.addr1 + item.addr2,
            cat,
            contentid: item.contentid,
            contenttypeid: item.contenttypeid,
            firstimage: item.firstimage,
            firstimage2: item.firstimage2,
            mapx: item.mapx,
            mapy: item.mapy,
            tel: item.tel,
            title: item.title,
            sigungucode: item.sigungucode,
            detailinfo: null
        }
    });
}

// TourAPI를 이용해 여행정보 저장
const saveTourInfo = async  () => {
    // 관광지 정보 저장
    let tourInfoList = await tourApi('areaBasedList1',`&areaCode=1&contentTypeId=12&listYN=Y`);
    const  saveTourInfoList = returnTourInfoMap(tourInfoList, 'tour');
    await tourModel.saveTourInfo(saveTourInfoList);

    // 축제 정보 저장
    let festaInfoList = await tourApi('areaBasedList1',`&areaCode=1&contentTypeId=15&listYN=Y&cat1=A02&cat2=A0207`);
    const  saveFestaInfoList = returnTourInfoMap(festaInfoList, 'festa');
    await tourModel.saveTourInfo(saveFestaInfoList);

    // 음식점 정보 저장
    let foodInfoList = await tourApi('areaBasedList1',`&areaCode=1&contentTypeId=39&listYN=Y`);
    const  saveFoodInfoList = returnTourInfoMap(foodInfoList, 'food');
    await tourModel.saveTourInfo(saveFoodInfoList);
}

// 여행 일정 생성시 필요한 코드 값들 : 지역, 일정, 테마
const getTourCodes = async () => {
    let tourCodes = await tourModel.selectTourCodeList({});

    return tourCodes.reduce((acc, item) => {
        if (!acc[item.type]) {
            acc[item.type] = [];
        }
        acc[item.type].push(item);
        return acc;
    }, {});
}

const getTourPlanData = async (sigunguCode, startDate, period, theme) => {
    let themeCode = [];
    let themeName = [];

    for (const item of theme) {
        themeCode.push(item.code);
        themeName.push(item.name);
    }

    let cond = {
        sigungucode: sigunguCode.code,
        cat: { $in: themeCode }
    };

    let selectTourInfoList = await tourModel.selectTourInfoList(cond, 0, 0);

    if (selectTourInfoList.length > 0) {
        // let generatePlanData = await gptAI(sigunguCode.name, period, themeName, selectTourInfoList, 'plan');
        // generatePlanData = JSON.parse(generatePlanData.content.replace(/^json\n|\n$/g, ''));
        let generatePlanData = ['2456536', '2759626', '2660731', '3076114', '2733970'];

        // 비동기 작업 생성
        const planDataPromises = selectTourInfoList
            .filter(item => generatePlanData.includes(item.contentid))
            .map(async data => {
                if (!data.detail) {
                    const detailIntro = await tourApi(
                        'detailIntro1',
                        `&contentId=${data.contentid}&contentTypeId=${data.contenttypeid}`
                    );

                    const result = detailIntro.map(({ contentid, contenttypeid, ...rest }) => rest);

                    return await tourModel.updateTourInfo(result, data.contentid);
                }
            });

        // 모든 비동기 작업을 기다림
        const planData = await Promise.all(planDataPromises);

        let result = await gptAI(sigunguCode.name, period, themeName, planData, 'detail');
        return result.content.replace(/^```json\n/, '').replace(/\n```$/, '');

    } else {
        return null;
    }
};

const insertTourPlan = async (data) => {
    return await tourModel.insertTourPlan(data);
}

// 여행정보 출력
const getTourInfoList = async (contentType, page, region, cat, catValue,searchText) => {
    const cond = {}

    if(contentType === "관광지")
        cond.contenttypeid = { $ne: 39 };
    else
        cond.contenttypeid = 39;

    const regex = (pattern) => new RegExp(`.*${pattern}.*`);

    if(searchText)
        cond.title = { $regex: regex(searchText)};

    if(region)
        cond.sigungucode = { $in: region.split(',')};

    if(cat)
        cond[cat] = { "$in": catValue.split(',')};

    const skip = 20 * (page - 1);

    const totalCount = await tourModel.getTourInfoTotalCount(cond);
    const tourInfoList = await tourModel.selectTourInfoList(cond, skip);

    return {items: tourInfoList, totalCount}
}

module.exports = {
    saveTourInfo,
    getTourCodes,
    insertTourPlan,
    getTourInfoList,
    getTourPlanData
}