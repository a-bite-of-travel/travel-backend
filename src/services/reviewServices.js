const reviewModel = require('../models/reviewModel');

const createReview = async(data) =>{
    const review = await reviewModel.createReview(data);
    return review;
};

const findAll = async() =>{
    return await reviewModel.find();
}

const findPostById = async (id) => {
    return await reviewModel.findById(id);
}

module.exports ={
    createReview,
    findAll,
    findPostById
};