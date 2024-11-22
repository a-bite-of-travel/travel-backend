const express = require('express');
require('dotenv').config();

const mongoose = require('./configs/mongoose-config');
const userRoute = require('./src/routes/userRoute');
const authRoute = require('./src/routes/authRoute');
const path = require('path');
const app = express();

app.use("/downloads", express.static(path.join(__dirname, "public/uploads")));

const postRoutes = require('./src/routes/reviewRoutes');

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use("/users",userRoute);
app.use("/auth",authRoute);

mongoose();

app.use('/', postRoutes);

app.listen(process.env.SERVER_PORT, () => {
   console.log(`server start`); 
});