const axios = require('axios');
require('dotenv').config();

// TourAPI 호출 함수
const tourApi = async (serviceCode, queryString) => {
    const apiKey = process.env.TOURAPI_KEY;
    const basUrl = `http://apis.data.go.kr/B551011/KorService1/${serviceCode}?serviceKey=${apiKey}
&MobileApp=AppTest&MobileOS=ETC&_type=json&pageNo=1&numOfRows=3000`

    try {
        const data = await axios.get(basUrl+queryString);
        return data.data.response.body.items.item;
    } catch (e) {
        console.log(`error 발생: ${e}`);
    }
}

// GPT AI 호출 함수
const gptAI = async (region, period, theme, data, prompt) => {
    const headers = {
        'api-key': process.env.AZURE_AI_KEY,
        'Content-Type': 'application/json'
    }

    const url = process.env.GPT_URI;

    const planPrompt = {
        "messages": [
            {"role": "system", "content": `
                역할 : 지역과 여행 기간 및 테마에 맞게 여행 일정을 생성
                여행지: 서울시 ${region}
                기간: ${period}
                테마: ${theme}
                
                요청사항: 
                1. 여행지는 최대 5곳까지만 구성
                2. 여행지 간의 거리는 3km 내외로 구성
                3. 응답은 여행 데이터에 있는 contentid로 배열을 만들어서 반환
                (배열 외의 답변은 금지, 기간이 1박2일 일 경우 배열 2개, 2박 3일은 배열 3개 반환)
                    [ {contentid}, {contentid}, .... ]
              
            `},
            {"role": "user", "content": "여행 데이터 " + JSON.stringify(data) }
        ]
    };

    const detailPrompt = {
        "messages": [
            {"role": "system", "content": `
                역할 : 전달받은 데이터를 기반으로 주차 가능 여부와 운영 여부를 체크해
                
                요청사항: 
                1. detailinfo를 제외한 나머지 값들은 그대로 반환하며, 주차 가능 여부(isParking)과 운영 여부(isOpen) 필드를 추가해서
                boolean Type으로 표현해줘
                2. json 데이터 외에 다른 응답은 금지
              
            `},
            {"role": "user", "content": "데이터 " + JSON.stringify(data) }
        ]
    }

    if(prompt === 'plan') {
        prompt = planPrompt;
    } else {
        prompt = detailPrompt;
    }

    const res = await axios.post(url, prompt, { headers});

    return res.data.choices[0].message;
}

module.exports = {
    tourApi, gptAI
}