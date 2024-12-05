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

// 생성된 여행 일정 정보
const getTourPlanData = async (sigunguCode, startDate, period, theme) => {
    theme = JSON.parse(theme);
    let themeCode = [];

    for (const item of theme) {
        themeCode.push(item.code);
    }

    let cond = {
        sigungucode: sigunguCode.code,
        cat: { $in: themeCode }
    };

    let selectTourInfoList = await tourModel.selectTourInfoList(cond, 0, 0);

    const sendGPTData = selectTourInfoList.map(info => ({
        addr: info.addr,
        contentid: info.contentid,
        cat: info.cat,
        contenttypeid: info.contenttypeid,
        title: info.title
    }));

    if (selectTourInfoList.length > 0) {
        console.log('sdksldksdl')
        let generatePlanData = await gptAI(sigunguCode.name, period, theme, sendGPTData, 'plan');

        // 프론트엔드랑 연동할 땐 아래의 코드 사용
        generatePlanData = JSON.parse(generatePlanData.content.replace(/(\s*)(\w+):/g, '$1"$2":') // 속성 이름에 따옴표 추가
            .replace(/'/g, '"'));

        // 백엔드 테스트할 때만 실행
        // generatePlanData = JSON.parse(generatePlanData.content.replace(/```json/, '').replace(/```/, ''));

        let planDataPromises = selectTourInfoList
            .filter(item => generatePlanData.result.some(arr => arr.includes(item.contentid)))
            .map(async data => {
                if (!data.detail) {
                    const detailIntro = await tourApi(
                        'detailIntro1',
                        `&contentId=${data.contentid}&contentTypeId=${data.contenttypeid}`
                    );

                    const result = detailIntro.map(({ contentid, contenttypeid, ...rest }) => rest);

                    await tourModel.updateTourInfo({ detailinfo: result }, data.contentid);
                }
                return data; // 데이터를 반환
            });

        const updatedData = await Promise.all(planDataPromises);

        const dataMap = updatedData.reduce((map, data) => {
            map[data.contentid] = data;
            return map;
        }, {});

        generatePlanData.result = generatePlanData.result.map(group =>
            group.map(contentid => dataMap[contentid] || null) // 데이터가 없는 경우 null 처리
        );

        let result = await gptAI('', startDate, '', generatePlanData.result, 'detail');
        generatePlanData.result = JSON.parse(result.content.replace(/^```json\n/, '').replace(/\n```$/, ''));

        console.log('generatePlanData >>>>>>>>>>>>>>>>> ', generatePlanData);
        return generatePlanData;
    } else {
        return null;
    }
};

const insertTourPlan = async (data) => {
    return await tourModel.insertTourPlan(data);
}

// 여행지 정보 출력
const getTourInfoList = async (contenttypeid, page, region, cat, catValue,searchText) => {
    const cond = {
        contenttypeid
    }

    const regex = (pattern) => new RegExp(`.*${pattern}.*`);

    if(searchText)
        cond.title = { $regex: regex(searchText)};

    if(region)
        cond.sigungucode = { $in: region.split(',')};

    if(cat)
        cond[cat] = { "$in": catValue.split(',')};

    const skip = 5 * (page - 1);

    const totalCount = await tourModel.getTourInfoTotalCount(cond);
    const tourInfoList = await tourModel.selectTourInfoList(cond, skip, 8);

    return {items: tourInfoList, totalCount}
}

// 여행지 상세 정보 출력
const getTourInfoDetail = async (contentid, contenttypeid) => {
    let tourInfoDetail = await tourModel.findOneTourInfo({contentid: contentid});
    if(!tourInfoDetail.overview || !tourInfoDetail.homepage) {
        const commonData =  await tourApi(
            'detailCommon1', `&contentId=${contentid}&overviewYN=Y&defaultYN=Y`
        );

        tourInfoDetail = await tourModel.updateTourInfo({ overview: commonData[0].overview, homepage: commonData[0].homepage }, contentid);
    }

    if(!tourInfoDetail.detailinfo) {
        let detailIntro = await tourApi(
            'detailIntro1',
            `&contentId=${contentid}&contentTypeId=${contenttypeid}`
        );
        detailIntro = detailIntro.map(({ contentid, contenttypeid, ...rest }) => rest);

        tourInfoDetail = await tourModel.updateTourInfo({ detailinfo: detailIntro }, contentid);
    }

    return tourInfoDetail;
}

module.exports = {
    saveTourInfo,
    getTourCodes,
    insertTourPlan,
    getTourInfoList,
    getTourPlanData,
    getTourInfoDetail
}