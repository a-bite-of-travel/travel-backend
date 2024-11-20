const reviewService = require('../services/reviewServices');

//리뷰 작성
const createReview = async(req, res) =>{
    try{
        const post = await reviewService.createReview(req.body);
        res.status(200).json({message:'ok', data: post});
    }catch(e){
        res.status(500).json({message: 'error', data:e.message});
    }
}

//리뷰 목록조회
const findAll = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    try {
        // 전체 데이터 조회 (배열로 반환)
        const posts = await reviewService.findAll(page, limit);

        res.status(200).json({
            message: 'ok',
            data: posts
        });
    } catch (e) {
        res.status(500).json({ message: 'error', data: e.message });
    }
};

//리뷰 아이디로 조회
const findPostById = async (req, res) => {
    try{
        const post = await reviewService.findPostById(req.params.id);
        res.status(200).json({message:'ok', data: post});
    }catch(e){
        res.status(500).json({message: 'error', data:e.message});
    }
}

//리뷰 수정
const updatePost = async (req, res) => {
    try{
        const id = req.params.id;        
        const post = await reviewService.updatePost(id, req.body);
        res.status(200).json({message:'ok', data: post});
    }catch(e){
        res.status(500).json({message: 'error', data:e.message});
    }
}

//리뷰 삭제
const deletePost = async (req, res) => {
    try{
        const id = req.params.id;        
        const post = await reviewService.deletePost(id);
        res.status(204).json({message:'ok'});
    }catch(e){
        res.status(500).json({message: 'error', data:e.message});
    }
}

//댓글 달기
const createComment = async(req, res) =>{
    try{
        const id = req.params.id;
        const { content } = req.body;
        if (!content) {
            return res.status(400).json({ message: '댓글 내용이 필요합니다.' });
        }
        const post = await reviewService.createComment(id, req.body);
        res.status(200).json({message:'ok', data: post});
    }catch(e){
        res.status(500).json({message: 'error', data:e.message});
    }
}

module.exports ={
    createReview,
    findAll,
    findPostById,
    updatePost,
    deletePost,
    createComment,
}
