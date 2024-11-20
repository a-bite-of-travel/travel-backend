const express = require('express');
const itineraryController = require('../controllers/itineraryController');

const route = express.Router();

route.get('/code', itineraryController.getTourCodes);
route.get('/', itineraryController.getItinerary);

module.exports = route;