const { tourApi, gptAI, kakaoApi } = require('../utils/api');
const tourModel = require('../models/tourModel');
const puppeteer = require('puppeteer');
const mongoose = require('mongoose');

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

    const sendGPTData = selectTourInfoList.map(info => ({
        addr: info.addr,
        contentid: info.contentid,
        cat: info.cat,
        contenttypeid: info.contenttypeid,
        title: info.title
    }));

    console.log('selectTourInfoList >>>>>>>>>>>>>>> ', selectTourInfoList);


    if (selectTourInfoList.length > 0) {
        let generatePlanData = await gptAI(sigunguCode.name, period, theme, sendGPTData, 'plan');

        console.log('generatePlanData >>>>>>>>>>>>>>>>>> ', generatePlanData);

        // 프론트엔드랑 연동할 땐 아래의 코드 사용
        generatePlanData = JSON.parse(generatePlanData.content.replace(/(\s*)(\w+):/g, '$1"$2":') // 속성 이름에 따옴표 추가
            .replace(/'/g, '"'));

        // 백엔드 테스트할 때만 실행
        // generatePlanData = JSON.parse(generatePlanData.content.replace(/```json/, '').replace(/```/, ''));

        let planDataPromises = selectTourInfoList
            .filter(item => generatePlanData.result.some(arr => arr.includes(item.contentid)));

        const updatedData = await Promise.all(planDataPromises);

        const dataMap = updatedData.reduce((map, data) => {
            map[data.contentid] = data;
            return map;
        }, {});

        generatePlanData.result = generatePlanData.result.map(group =>
            group.map(contentid => dataMap[contentid] || null) // 데이터가 없는 경우 null 처리
        );
        generatePlanData.period = period;
        generatePlanData.startDate = startDate;
        generatePlanData.theme = themeName.join(',');
        return generatePlanData;
    } else {
        return null;
    }
};

const showTourInfoDetailWithKaKao = async (x, y, title) => {
    try {
        const placeUrl =  await kakaoApi(x, y, title);

        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        // 페이지 열기
        await page.goto(placeUrl, { waitUntil: 'networkidle0' });

        // 데이터 추출
        const placeDetails = await page.evaluate(() => {
            const getTextContent = (selector) => {
                const element = document.querySelector(selector);
                return element ? element.innerText.trim() : null;
            };

            const getListItems = (selector) => {
                const elements = document.querySelectorAll(selector);
                return Array.from(elements).map(el => el.innerText.trim());
            };

            const getOperationHours = () => {
                const listItems = document.querySelectorAll('.list_operation li');
                return Array.from(listItems).map(item => {
                    const dayElement = item.querySelector('.txt_operation');
                    const timeElement = item.querySelector('.time_operation');
                    const day = dayElement ? dayElement.innerText.trim() : null;
                    const time = timeElement ? timeElement.innerText.trim() : null;
                    return { day, time };
                });
            };

            const getOffDays = () => {
                const offDayContainer = document.querySelector('.displayOffdayList .list_operation');
                if (!offDayContainer) return null;

                const offDays = offDayContainer.querySelectorAll('li');
                return Array.from(offDays).map(day => day.innerText.trim());
            };

            const getMenuItems = () => {
                const menuContainer = document.querySelector('div[data-viewid="menuInfo"]');
                if (!menuContainer) return null;

                const menuItems = menuContainer.querySelectorAll('ul.list_menu > li:not(.hide)');
                return Array.from(menuItems).map(item => {
                    const nameElement = item.querySelector('.loss_word');
                    const priceElement = item.querySelector('.price_menu');
                    const name = nameElement ? nameElement.innerText.trim() : null;
                    const price = priceElement ? priceElement.innerText.trim() : null;
                    return { name, price };
                });
            };

            const getRatingInfo = () => {
                const ratingElement = document.querySelector('.grade_star');
                if (!ratingElement) return null;

                const ratingText = getTextContent('.grade_star .num_rate');
                const styleWidth = ratingElement.querySelector('.inner_star')?.style.width;
                const percentage = styleWidth ? parseFloat(styleWidth) : null;

                return {
                    rating: ratingText ? parseFloat(ratingText.split('점')[0]) : null,
                    starPercentage: percentage
                };
            };

            return {
                address: getTextContent('.location_detail .txt_address'),
                addressNumber: getTextContent('.location_detail .txt_addrnum'),
                operationHours: getOperationHours(),
                offDays: getOffDays(),
                contactNumber: getTextContent('.num_contact .txt_contact'),
                reservationDeliveryPackaging: getTextContent('.placeinfo_default:nth-of-type(5) .location_detail'),
                facilities: getListItems('.list_facility li .color_g'),
                menu: getMenuItems(),
                ratingInfo: getRatingInfo(),
            };
        });

        console.log("상세 정보:", placeDetails);

        placeDetails.placeUrl = placeUrl;

        await browser.close();

        return placeDetails;
    } catch (error) {
        console.error("크롤링 중 에러 발생: ", error);
    }
}

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

// 여행 일정 조회
const findByIdTourPlanList = async (id) => {
    return await tourModel.findByIdTourPlanList(new mongoose.Types.ObjectId(id));
}

const selectTourPlanDetail = async (id) => {
    const planDetail = await tourModel.selectTourPlanDetail(new mongoose.Types.ObjectId(id));

    const days = await Promise.all(
        planDetail.contentid.map(async (contentIds, i) => {
            const dayResult = await Promise.all(
                contentIds.map(async (contentId) => {
                    const tourInfo = await tourModel.findOneTourInfo({ contentid: contentId });

                    return {
                        addr: tourInfo.addr,
                        firstimage2: tourInfo.firstimage2,
                        title: tourInfo.title,
                    };
                })
            );

            // day별로 결과 반환
            return { planTitle: contentIds.title, [`day${i + 1}`]: dayResult };
        })
    );

    return {
        title: planDetail.title,
        days,
    };
};

module.exports = {
    saveTourInfo,
    getTourCodes,
    insertTourPlan,
    getTourInfoList,
    getTourPlanData,
    getTourInfoDetail,
    showTourInfoDetailWithKaKao,
    findByIdTourPlanList,
    selectTourPlanDetail
}