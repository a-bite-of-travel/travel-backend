const reviewService = require('../services/reviewServices');

const createReview = async(req, res) =>{
    try{
        const {title, content, imageUrl, tag} = req.body;
        const post = await reviewService.createReview({
            title: title,
            content: content,
            imageUrl: imageUrl,
            tag:tag
        });
        console.log(req.body);
        res.status(200).json({message:'ok', data: post});
    }catch(e){
        res.status(500).json({message: 'error', data:e.message});
    }
}

const findAll = async (req, res) => {
    try{
        const posts = await reviewService.findAll();
        res.status(200).json({message:'ok', data: posts});
    }catch(e){
        res.status(500).json({message: 'error', data:e.message});
    }
}

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
