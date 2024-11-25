const { tourApi, gptAI } = require('../utils/api');
const { tourCodeFilter, setTourInfoCond, tourApiGetDetailInfo } = require('../utils/tourSubFunc');
const tourModel = require('../models/tourModel');
const waait = require('waait');

// TourAPI를 이용해 여행정보 저장
const insertTourInfo = async () => {
    for(let i=1; i<26; i++) {
        let areaBasedList = await tourApi('areaBasedList1', `&areaCode=1&sigunguCode=${i}&listYN=Y`);

        areaBasedList = areaBasedList.filter(item => (item.cat2 !== 'A0206') &&
            (item.cat2 !== 'A0207') &&
            (item.cat2 !== 'A0208') &&
            (item.cat1 !== 'B02') )
            .map(item => ({
            addr1: item.addr1, // 주소
            addr2: item.addr2, // 상세주소
            cat1: item.cat1, // 대분류
            cat2: item.cat2, // 중분류
            cat3: item.cat3, // 소분류
            contentid: item.contentid, // 콘텐츠ID
            contenttypeid: item.contenttypeid, // 콘텐츠 type
            firstimage: item.firstimage, // 원본 이미지
            firstimage2: item.firstimage2, // 썸네일용 이미지
            mapx: item.mapx, // x좌표
            mapy: item.mapy, // y좌표
            tel: item.tel,  // 전화번호
            title: item.title, // 지명
            sigungucode: item.sigungucode // 시군구 코드
        }));

        await tourModel.insertTourInfo(areaBasedList);

        await waait(1000);
    }
}

// 여행 일정 생성을 위해 필요한 코드 값들
// 지역, 테마, 여행일정
const getTourCodes = async () => {
    let tourCodes = await tourModel.selectTourCodeList({});

    const sigunguCode = tourCodeFilter("sigungu", tourCodes);
    const periodCode = tourCodeFilter("period", tourCodes);
    const themeCode = tourCodeFilter("theme", tourCodes);

    return { sigunguCode, periodCode, themeCode }
}

// 여행지역, 출발일자, 기간(하루, 1박2일, 2박3일), 테마를 입력받아 여행지 목록 생성
// - theme: [{ code: 22, name: "dd" }, { code: 22, name: "dd" }]
// - sigunguCode :  { code: 1, name: "dd" } json
const getTourInfo = async (sigunguCode, startDate, period, theme) => {
    // themeCode 조건 값 가져오기.
    let themeCode = [];
    let themeName = [];

    for(const item of theme) {
        themeCode.push(item.code);
        themeName.push(item.name);
    }

    let themeCodeCond = await tourModel.selectTourCodeList({code: { $in: themeCode }});

    const cond = setTourInfoCond(themeCodeCond, sigunguCode.code); // tourInfoList 찾을 condition 생성 후 반환
    let tourInfoList = await tourModel.selectTourInfoList(cond);

    // gpt로 여헹일정 생성을 위한 contentid 받아오기.
    // 여행 정보 전달 시에 gpt가 답변하기 위해 필요한 핵심 정보만을 추려서 전송하기
    let getContents = await gptAI(sigunguCode.name, period, themeName, tourInfoList);
    getContents = JSON.parse(getContents.content.replace(/^```json\n|\n```$/g, ''));

    let tourDetailInfoList = await tourModel.selectTourDetailInfoList(
        {contentid: { $in: tempContent.map(item => item.contentid) }});
    let detailContentIds = tourDetailInfoList.map(item => item.contentid);

    getContents = getContents.filter(item => !(detailContentIds.includes(item.contentid)));

    // 데이터베이스에 저장된 세부 정보가 없을 경우에 api로 데이터 검색 후 insert
    if(getContents.length !== 0) {
        for(let info of getContents) {
            const data = await tourApiGetDetailInfo(info.contenttypeid, info.contentid);

            await tourModel.insertTourDetailInfo(data[0]);
            tourDetailInfoList.push(data);
        }
    }

    tourInfoList = tourInfoList.filter(item =>
        getContents.some(temp => temp.contentid === item.contentid)
    );

    return { tourInfoList, tourDetailInfoList };

}

const insertTourPlan = async (data) => {
    return await tourModel.insertTourPlan(data);
}

module.exports = {
    getTourCodes,
    getTourInfo,
    insertTourInfo,
    insertTourPlan
}