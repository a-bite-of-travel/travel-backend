const express = require('express');
const tourController = require('../controllers/tourController');

const route = express.Router();

route.get('/info', tourController.getTourInfo);
route.get('/code', tourController.getTourCodes);
route.post('/info', tourController.insertTourInfo);
route.post('/plan', tourController.insertTourPlan);

module.exports = route;