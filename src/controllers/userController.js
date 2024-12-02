const userService = require("../services/userService");

const findAll = async (req, res) => {
    try {
        const users = await userService.findAll();
        res.status(200).json({ data: users, message: 'ok' });
    } catch (e) {
        res.status(500).json({ message: e });
    }
}

const createUser = async (req, res) => {
    try {
        const { email, password, confirmPassword, nickName, profileImage } = req.body;
        const result = await userService.createUser({ email, password, confirmPassword, nickName, profileImage });

        res.status(201).json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

module.exports = {
    findAll,
    createUser,
}; 