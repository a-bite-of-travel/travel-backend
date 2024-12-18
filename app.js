const express = require('express');
const cors = require('cors');
const errorHandler = require('./src/middlewares/errorHandler');
require('dotenv').config();

const mongoose = require('./configs/mongoose-config');
const tourRoute = require('./src/routes/tourRoute');
const userRoute = require('./src/routes/userRoute');
const authRoute = require('./src/routes/authRoute');
const postRoutes = require('./src/routes/reviewRoutes');
const uploadRoute = require('./src/routes/uploadRoute');

const path = require('path');
const app = express();

app.use(
   cors({
     origin: process.env.FRONT_END, // React 앱 주소
     methods: ["GET", "POST", "PUT", "DELETE"], // 허용할 HTTP 메서드
     credentials: true, // 쿠키, 인증 정보를 포함하려면 설정
   })
 );

app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }))
app.use('/users',userRoute);
app.use('/auth',authRoute);
app.use('/review', postRoutes);
app.use('/tour', tourRoute);
app.use('/upload', uploadRoute);

app.use(errorHandler);

mongoose();

app.listen(process.env.SERVER_PORT, () => {
   console.log(`server start`);
});