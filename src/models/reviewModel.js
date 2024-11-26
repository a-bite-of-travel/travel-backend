const reviewModel = require('../schemas/review');
const commentModel = require('../schemas/comment');

//리뷰 작성
const createReview = async(data) =>{
    const insertReview = new reviewModel(data);
    return await insertReview.save();
}

//리뷰 목록조회
const findAll = async () => {
    return await reviewModel.find().select('title content imageUrl tags status createdAt');
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
    const savedComment = await newComment.save();

    const updatedReview = await reviewModel.findByIdAndUpdate(
        id, 
        { $push: { comments: savedComment._id } },  // savedComment._id로 댓글 추가
        { new: true }  // 업데이트된 리뷰를 반환
    );
    return savedComment;
}

//댓글 수정
const updateComment = async (id, data) =>{
    return await reviewModel.updateComment(id, data);
}

//댓글 삭제
const deleteComment = async (id, data) =>{
    return await reviewModel.deleteComment(id, data);
}

module.exports  = { 
    createReview,
    findAll,
    findPostById,
    updatePost,
    deletePost,
    createComment,
    updateComment,
    deleteComment
};