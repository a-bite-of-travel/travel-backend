const { getTourAPIData } = require('../utility/getTourAPIData');
const { gptAI } = require('../utility/azureAI');

// 서울시 지역 목록 및 테마 목록 전송
const getTourCodes = async () => {
    const areaCode = await getTourAPIData('areaCode1', '&areaCode=1');

    // contentCode는 데이터베이스 저장할 예정.
    const contentCode = [
            { code:12, name:'관광지' },
            { code:14, name:'문화시설' },
            { code:15, name:'행사/공연/축제' },
            { code:25, name:'여행코스' },
            { code:28, name:'레포츠' },
            { code:38, name:'쇼핑' },
            { code:39, name:'음식점' }
    ];

    return {areaCode: areaCode.items, contentCode }
}

// 여행지역, 여행일자, 일정(당일,1박2일,2박3일), 테마를 입력받아 여행지 목록 생성
const getItinerary = async (region, startDate, duration, theme) => {

    let areaBasedList = await getTourAPIData('areaBasedList1',
        `&contentTypeId=${theme}&areaCode=1&sigunguCode=${region}&listYN=Y`);

    // GPT에게 여행 목록을 전송할 때, 핵심 내용만 전달하여 토큰 소모를 절약을 위해 데이터 파싱
    const extractedAreaList = areaBasedList.items.item.map(item => ({
        addr1: item.addr1,
        addr2: item.addr2,
        contentid: item.contentid,
        mapx: item.mapx,
        mapy: item.mapy,
        title: item.title
    }));

    // let contentIds = await gptAI('강남구', '하루', '관광지', extractedAreaList);
    // contentIds = JSON.parse(contentIds.content.replace(/^```json\n|\n```$/g, ''));

    // 임시 데이터
    let contentIds = [ '126519', '127376', '3065938', '814195', '1366921'];

    areaBasedList = areaBasedList.items.item.filter(item => contentIds.includes(item.contentid));

    return { areaBasedList };
}

module.exports = {
    getTourCodes,
    getItinerary
}