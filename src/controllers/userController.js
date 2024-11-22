const userService = require("../services/userService");

const createUser = async (req, res) => {
    try {
        const { email, password, nickName, profile_img } = req.body;
        const result = await userService.createUser({ email, password, nickName, profile_img });

        res.status(201).json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

module.exports = {
    createUser
}; 