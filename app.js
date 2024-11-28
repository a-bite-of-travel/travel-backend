const express = require('express');
require('dotenv').config();

const mongoose = require('./configs/mongoose-config');
const tourRoute = require('./src/routes/tourRoute');
const userRoute = require('./src/routes/userRoute');
const authRoute = require('./src/routes/authRoute');  
const path = require('path');
const cors = require("cors");
const app = express();

app.use(
   cors({
     origin: "http://localhost:3000", // React 앱 주소
     methods: ["GET", "POST", "PUT", "DELETE"], // 허용할 HTTP 메서드
     credentials: true, // 쿠키, 인증 정보를 포함하려면 설정
   })
 );

app.use("/downloads", express.static(path.join(__dirname, "public/uploads")));

const postRoutes = require('./src/routes/reviewRoutes');

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use("/users",userRoute);
app.use("/auth",authRoute);

app.use('/tour', tourRoute);

mongoose();

app.use('/', postRoutes);

app.listen(process.env.SERVER_PORT, () => {
   console.log(`server start`);
});