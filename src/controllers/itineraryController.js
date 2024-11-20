const itineraryService = require('../services/itineraryService');

const getTourCodes = async (req, res) => {
    const data = await itineraryService.getTourCodes();

    res.status(200).json({message: 'ok', data});
}

const getItinerary = async (req, res) => {
    const {region, startDate, duration, theme} = req.body
    const data = await itineraryService.getItinerary(region, startDate, duration, theme);

    res.status(201).json({message: 'ok', data});
}

module.exports = {
    getTourCodes,
    getItinerary
}