const axios = require('axios');
require('dotenv').config();

// TourAPI 호출 함수
const tourApi = async (serviceCode, queryString) => {
    const apiKey = process.env.TOURAPI_KEY;
    const basUrl = `http://apis.data.go.kr/B551011/KorService1/${serviceCode}?serviceKey=${apiKey}
&MobileApp=AppTest&MobileOS=ETC&_type=json&pageNo=1&numOfRows=1000`

    try {
        const data = await axios.get(basUrl+queryString);
        return data.data.response.body.items.item;
    } catch (e) {
        console.log(`error 발생: ${e}`);
    }
}

// GPT AI 호출 함수
const gptAI = async (region, period, theme, data) => {
    const headers = {
        'api-key': process.env.AZURE_AI_KEY,
        'Content-Type': 'application/json'
    }

    const url = process.env.GPT_URI;

    const prompt =   {
        "messages": [
            {"role": "system", "content": `
                역할 : 전달받은 여행 데이터를 기반으로 여행일정을 생성
                여행지: 서울시 ${region}
                기간: ${period}
                테마: ${theme}
                
                요청사항: 
                1. 여행테마에 알맞게 최대 5곳까지만 구성. 
                2. 범위는 좌표 혹은 주소를 기반으로 10km 내외로 구성
                3. 응답은 여행 데이터에 있는 contentid와 contenttypeid로 아래와 같은 JSON을 만들어서 반환(JSON 외의 답변은 금지)
                    [
                        {contentid: " ",  contenttypeid: " " },
                        {contentid: " ",  contenttypeid: " " },
                        ...
                    ]
              
            `},
            {"role": "user", "content": "여행 데이터 " + JSON.stringify(data) }
        ]
    };

    const res = await axios.post(url, prompt, { headers});

    return res.data.choices[0].message;
}

module.exports = {
    tourApi, gptAI
}