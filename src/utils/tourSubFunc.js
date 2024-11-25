const { tourApi } = require('./api');

const tourCodeFilter = (type, codes) => {
    return codes.filter(item => (item.type === type))
        .map(item => ({
            name: item.name,
            code: item.code
        }));
}

const setTourInfoCond = (themeCodeCond, sigunguCode) => {
    let cond = {
        $and: [
            { sigungucode: sigunguCode, }
        ]
    }
    let orConditions = [];
    let ninCondition = null;

    themeCodeCond.forEach((item) => {
        item.cond.forEach((theme) => {
            if (theme.cat2) {
                orConditions.push({ cat2: { $in: [theme.cat2] } });
            }
            if (theme.cat1) {
                orConditions.push({ cat1: { $in: [theme.cat1] } });
            }
            if (theme.cat3 && Array.isArray(theme.cat3)) {
                orConditions.push({ cat3: { $in: theme.cat3 } });

                // $nin 조건은 code === 2005일 때만 추가
                if (item.code === 2005) {
                    ninCondition = { cat3: { $nin: theme.cat3 } };
                }
            }
        });
    });

    if (orConditions.length > 0) {
        cond.$and.push({ $or: orConditions });
    }

    // $nin 조건 추가
    if (ninCondition) {
        cond.$and.push(ninCondition);
    }

    return cond;
}

// 컨텐츠 타입에 따라서 세부 정보가 달라지므로, 이를 처리하기 위한 함수
const tourApiGetDetailInfo = async (contentType, contentId) => {
    const detailCommon = await tourApi('detailCommon1',
        `&contentId=${contentId}&defaultYN=Y&overviewYN=Y`);

    const detailIntro = await tourApi('detailIntro1',
        `&contentId=${contentId}&contentTypeId=${contentType}`);

    switch (contentType) {
        case "12": {
            return detailCommon.map(common => {
                const intro = detailIntro.find(introItem => introItem.contentid === common.contentid);

                const etc = detailIntro.map(item => ({
                    opendate: item.opendate,
                    useseason: item.useseason,
                    expagerange: item.expagerange,
                    expguide: item.expguide
                }));

                return {
                    contentid: contentId,
                    contenttypeid: contentType,
                    hmpg: [common.homepage],
                    overview: common.overview,
                    restdate: intro ? intro.restdate : null,
                    opentime: null,
                    usetime: intro ? intro.usetime : null,
                    parking: intro ? intro.parking : null,
                    parkingfee: null,
                    infocenter: intro ? intro.infocenter: null,
                    accomcount: intro ? intro.accomcount: null,
                    usefee: null,
                    reservation: null,
                    etc: etc[0]
                };
            });
        }
        case "14": {
            return detailCommon.map(common => {
                const intro = detailIntro.find(introItem => introItem.contentid === common.contentid);

                const etc = detailIntro.map(item => ({
                    discountinfo: item.discountinfo,
                    spendtime: item.spendtime,
                }));

                return {
                    contentid: contentId,
                    contenttypeid: contentType,
                    hmpg: [common.homepage],
                    overview: common.overview,
                    restdate: intro ? intro.restdateculture : null,
                    opentime: null,
                    usetime: intro ? intro.usetimeculture : null,
                    parking: intro ? intro.parkingculture : null,
                    parkingfee: intro ? intro.parkingfee : null,
                    infocenter: intro ? intro.infocenterculture: null,
                    accomcount: intro ? intro.accomcountculture: null,
                    usefee: null,
                    reservation: null,
                    etc: etc[0]
                };
            });
        }
        case "28": {
            return detailCommon.map(common => {
                const intro = detailIntro.find(introItem => introItem.contentid === common.contentid);

                const etc = detailIntro.map(item => ({
                    openperiod: item.openperiod,
                    expagerangeleports: item.expagerangeleports,
                }));

                return {
                    contentid: contentId,
                    contenttypeid: contentType,
                    hmpg: [common.homepage],
                    overview: common.overview,
                    restdate: intro ? intro.restdateleports : null,
                    opentime: null,
                    usetime: intro ? intro.usetimeleports : null,
                    parking: intro ? intro.parkingleports : null,
                    parkingfee: intro ? intro.parkingfeeleports : null,
                    infocenter: intro ? intro.infocenterleports: null,
                    accomcount: intro ? intro.accomcountleports: null,
                    usefee: intro ? intro.usefeeleports: null,
                    reservation: intro ? intro.reservation: null,
                    etc: etc[0]
                };
            });
        }
        case "38": {
            return detailCommon.map(common => {
                const intro = detailIntro.find(introItem => introItem.contentid === common.contentid);

                const etc = detailIntro.map(item => ({
                    fairday: item.fairday,
                }));

                return {
                    contentid: contentId,
                    contenttypeid: contentType,
                    hmpg: [common.homepage],
                    overview: common.overview,
                    restdate: null,
                    opentime: intro ? intro.opentime : null,
                    usetime: null,
                    parking: intro ? intro.parkingshopping : null,
                    parkingfee: null,
                    infocenter: null,
                    accomcount: null,
                    usefee: null,
                    reservation: null,
                    etc: etc[0]
                };
            });
        }
        case "39": {
            return detailCommon.map(common => {
                const intro = detailIntro.find(introItem => introItem.contentid === common.contentid);

                const etc = detailIntro.map(item => ({
                    packing: item.packing,
                }));

                return {
                    contentid: contentId,
                    contenttypeid: contentType,
                    hmpg: [common.homepage],
                    overview: common.overview,
                    restdate: intro ? intro.restdatefood : null,
                    opentime: intro ? intro.opentimefood : null,
                    usetime: null,
                    parking: intro ? intro.parkingfood : null,
                    parkingfee: null,
                    infocenter: intro ? intro.infocenterfood : null,
                    accomcount: null,
                    usefee: null,
                    reservation: intro ? intro.reservationfood : null,
                    etc: etc[0]
                };
            });
        }
    }
}

module.exports = {
    tourCodeFilter,
    setTourInfoCond,
    tourApiGetDetailInfo
}