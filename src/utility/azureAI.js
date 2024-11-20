const axios = require('axios');
require('dotenv').config();

// azure의 openai를 이용하여 gpt 사용
const gptAI = async (region, duration, theme, data) => {
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
                기간: ${duration}
                테마: ${theme}
                
                요청사항: 
                1. 여행테마에 알맞게 최대 5곳까지만 구성. 
                2. 범위는 좌표 혹은 주소를 기반으로 10km 내외로 구성
                3. 응답은 여행 데이터에 있는 contentid로 배열을 만들어서 반환(배열 외의 답변은 금지)
              
            `},
            {"role": "user", "content": "여행 데이터 " + JSON.stringify(data) }
    ]
    };

    const res = await axios.post(url, prompt, { headers});

    return res.data.choices[0].message;
}

module.exports = {
    gptAI
}