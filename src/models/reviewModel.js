const reviewModel = require('../schemas/review');
const commentModel = require('../schemas/comment');

//리뷰 작성
const createReview = async(data) =>{
    const insertReview = new reviewModel(data);
    return await insertReview.save();
}

//리뷰 목록조회
const findAll = async () => {
    return await reviewModel.find().select('title content imageUrl tags createdAt');
}

//리뷰 아이디로 조회
const findPostById = async (id) => {
    return await reviewModel.findById(id).populate('comments');
}

//리뷰 수정
const updatePost = async (id, data) =>{
    return await reviewModel.findByIdAndUpdate(id, data);
}

//리뷰 삭제
const deletePost = async (id) => {
    return await reviewModel.findByIdAndDelete(id)
}

//댓글 달기
const createComment = async (id, data) =>{
    const newComment = new commentModel({
        content: data.content,
        reviewId: id
    });
    return await newComment.save();
}


//댓글 수정

//댓글 삭제

module.exports  = { 
    createReview,
    findAll,
    findPostById,
    updatePost,
    deletePost,
    createComment,
};