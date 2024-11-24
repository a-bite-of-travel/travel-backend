const express = require('express');
require('dotenv').config();

const mongoose = require('./configs/mongoose-config');
const tourRoute = require('./src/routes/tourRoute');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/tour', tourRoute);

mongoose();

app.listen(process.env.SERVER_PORT, () => {
   console.log(`server start`);
});