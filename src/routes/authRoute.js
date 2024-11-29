const express = require('express');
const { register, login, refresh, deleteUser, logout, validate } = require('../controllers/authController');
const { check } = require('express-validator');
const path = require('path');
const multer = require('multer');

const upload_dir = "public/uploads";


const storage = multer.diskStorage({
    destination: `${upload_dir}`,
    filename: function(req, file, cb){ // originalname : test.png 
        cb(null, 
            path.parse(file.originalname).name  + // test
            "-" + 
            Date.now() +
            path.extname(file.originalname) //.png
        )
    }
});


const upload = multer({ storage: storage}); 

const router = express.Router();

router.post('/register', upload.single('profileImage'), [
    check('email').isEmail().withMessage("이메일형식에 맞지 않습니다.").notEmpty().withMessage("필수입력 항목입니다."),
    check('password').notEmpty().withMessage("필수입력 항목입니다."),
    check('nickName').notEmpty().withMessage("필수입력 항목입니다."),
    check('confirmPassword').notEmpty().withMessage("필수입력 항목입니다.")
], register);



router.post('/login', login);
router.post('/refresh', refresh);
router.delete("/delete", deleteUser);
router.post('/logout', logout);
router.post('/validate', validate,);

module.exports = router;
