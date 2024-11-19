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
        console.log(req.body);
        res.status(200).json({message:'ok', data: post});
    }catch(e){
        res.status(500).json({message: 'error', data:e.message});
    }
}

//리뷰 목록조회
const findAll = async (req, res) => {
    try{
        const posts = await reviewService.findAll();
        res.status(200).json({message:'ok', data: posts});
    }catch(e){
        res.status(500).json({message: 'error', data:e.message});
    }
}

//리뷰 아이디로 조회
const findPostById = async (req, res) => {
    try{
        const post = await reviewService.findPostById(req.params.id);
        res.status(200).json({message:'ok', data: post});
    }catch(e){
        res.status(500).json({message: 'error', data:e.message});
    }
}


module.exports ={
    createReview,
    findAll,
    findPostById
}
