const express = require('express');
require('dotenv').config();

const mongoose = require('./configs/mongoose-config');
const itineraryRoute = require('./src/routes/itineraryRoute');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/travel', itineraryRoute);

mongoose();

app.listen(process.env.SERVER_PORT, () => {
   console.log(`server start`);
});