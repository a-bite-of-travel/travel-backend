const reviewModel = require('../schemas/review');

const createReview = async(data) =>{
    const insertReview = new reviewModel(data);
    return await insertReview.save();
}

const findAll = async () => {
    return await reviewModel.find();
}

const findPostById = async (id) => {
    return await reviewModel.Review.findById(id, {
        include: {model: models.User}
    });
}

module.exports  = { 
    createReview,
    findAll,
    findPostById
};