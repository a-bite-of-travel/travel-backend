const reviewService = require('../services/reviewServices');

//리뷰 작성
const createReview = async(req, res) =>{
    try{
        const {title, content, imageUrl, tags} = req.body;
        const post = await reviewService.createReview({
            title: title,
            content: content,
            imageUrl: imageUrl,
            tags:tags,
        });
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
        
        const totalPosts = posts.length;  // 배열의 길이 사용
        
        // 전체 페이지 수 계산
        const totalPages = Math.ceil(totalPosts / limit);
        
        res.status(200).json({
            message: 'ok',
            data: posts,
            totalPosts,
            totalPages,
            currentPage: page,
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

module.exports ={
    createReview,
    findAll,
    findPostById,
    updatePost,
    deletePost
}
