const express = require('express');
require('dotenv').config();

const mongoose = require('./configs/mongoose-config');
const tourRoute = require('./src/routes/tourRoute');
const userRoute = require('./src/routes/userRoute');
const authRoute = require('./src/routes/authRoute');

const app = express();

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