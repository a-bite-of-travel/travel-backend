const reviewService = require('../services/reviewServices');

// 리뷰 작성
const createReview = async (req, res) => {
    try {
        // 요청 본문에서 필요한 데이터 추출
        const { title, content, imageUrl, tags, reviewType } = req.body;

        // 로그인된 사용자 정보를 가져옵니다.
        const userId = req.user.id; // 사용자 ID
        const userName = req.user.nickName; // 사용자 닉네임

        // 새로운 리뷰 객체 생성
        const newReview = {
            title,
            content,
            imageUrl,
            tags,
            reviewType,
            userName: userName,  // 리뷰 작성자 이름 (닉네임)
            userId: userId,      // 리뷰 작성자 ID
        };

        // reviewService를 통해 리뷰 저장
        const savedReview = await reviewService.createReview(newReview);
        
        console.log(userId);
        res.status(201).json({ message: '리뷰가 성공적으로 생성되었습니다.', review: savedReview });
    } catch (error) {
        res.status(500).json({ message: '리뷰 생성 중 오류가 발생했습니다.', error });
    }
};

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

//유저 리뷰 목록조회
const findUserReview = async (req, res) => {
    try{
        const userId = req.params.userId;
        const post = await reviewService.findUserReview(userId);
        res.status(200).json({message:'ok', data: post});
    }catch(e){
        res.status(500).json({message: 'error', data:e.message});
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
        console.log('Request User:', req.user);
        const id = req.params.id;
        const { content } = req.body;
        const userName = req.user.nickName;
        if (!content) {
            return res.status(400).json({ message: '댓글 내용이 필요합니다.' });
        }
        const newComment = {
            content,
            userName: userName
        };
        const post = await reviewService.createComment(id, newComment);
        res.status(200).json({message:'ok', data: post});
    }catch(e){
        res.status(500).json({message: 'error', data:e.message});
    }
}

//댓글 수정
const updateComment = async (req, res) => {
    try{
        const { id } = req.params;       
        const updatedComment  = await reviewService.updateComment(id, req.body);
        res.status(200).json({message:'ok', data: updatedComment});
    }catch(e){
        res.status(500).json({message: 'error', data:e.message});
    }
}

//댓글 삭제
const deleteComment = async (req, res) => {
    const { id } = req.params;
    try{   
        const deletedComment = await reviewService.deleteComment(id);
        res.status(204).json({message:'ok', data: deletedComment });
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
    updateComment,
    deleteComment,
    findUserReview 
}
