const express = require('express');
require('dotenv').config();

const mongoose = require('./configs/mongoose-config');

const app = express();

const postRoutes = require('./src/routes/reviewRoutes');

app.use(express.json());
app.use(express.urlencoded({extended: true}));

mongoose();

app.use('/', postRoutes);

app.listen(process.env.SERVER_PORT, () => {
   console.log(`server start`);
});