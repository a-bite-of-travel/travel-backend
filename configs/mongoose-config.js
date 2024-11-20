const mongoose = require('mongoose');
require('dotenv').config();

const mongooseConnect = () => {
    mongoose.connect(process.env.DB_URI); // connect mongodb
    const db = mongoose.connection; // get connection object

    db.on("error", (err)=>{ // error 발생했을 때
        console.error(`db connect fail : ${JSON.stringify(err)}`);
    });

    db.once("open", ()=> { // 연결이 성공했을 때
        console.log(`db connect success`);
    });
}

module.exports = mongooseConnect;