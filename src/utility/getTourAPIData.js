const axios = require('axios');
require('dotenv').config();

// TourAPI 호출 메소드
const getTourAPIData = async (serviceCode, queryString) => {
    const apiKey = process.env.TOURAPI_KEY;
    const basUrl = `http://apis.data.go.kr/B551011/KorService1/${serviceCode}?serviceKey=${apiKey}
&MobileApp=AppTest&MobileOS=ETC&_type=json&pageNo=1&numOfRows=100`

    try {
        const data = await axios.get(basUrl+queryString);

        return data.data.response.body;
    } catch (e) {
        console.err(`error 발생: ${e}`);
    }

}

module.exports = { getTourAPIData }

