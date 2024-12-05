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
                역할 : 전달 받은 여행 데이터를 기반으로 테마에 알맞게 ${period}간의 일정을 생성해줘
                테마: ${theme}
                지역: ${region}
                
                참고사항:
                1. cat의 코드와 전달받은 테마의 code는 동일
                2. 이때, contenttypeid가 12는 관광지, 15는 음식점이므로 이를 잘 섞어서 일정 생성.
                
                요청사항: 
                1. 여행지는 하루에 최대 5곳까지만 구성(1박2일일 경우 최대 10곳, 2박 3일일 경우 15곳)
                2. 여행 데이터에 있는 contentid로 배열을 만들기
                3. 생성된 일정에 대해서 250자 내외로 설명 작성
                4. 기간이 하루일 경우 배열 하나, 1박 2일 경우 배열 2개, 2박 3일은 배열 3개 반환
                5. 최종 응답 형태 (아래의 응답 형태 외의 답변은 금지, 주석 작성 절대 금지)
                 - result는 contentid로 이루어진 배열임 
                 {
                   summary: "설명",
                   result: [ [], [], [] ]   
                 }
       
            `},
            {"role": "user", "content": "여행 데이터 " + JSON.stringify(data) }
        ]
    };

    const detailPrompt = {
        "messages": [
            {"role": "system", "content": `
                역할 : 전달받은 데이터를 기반으로 ${period}에 주차 가능 여부와 운영 여부를 파악
                
                참고 사항
                parking, parkingfood, : 주차 여부
                restdate, restdatefood : 쉬는 날
                usetime, opentimefood: 운영 시간 
                
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