const express = require('express');
require('dotenv').config();

const mongoose = require('./configs/mongoose-config');
const userRoute = require('./src/routes/userRoute');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use("/user",userRoute);

mongoose();

app.listen(process.env.SERVER_PORT, () => {
   console.log(`server start`); 
});