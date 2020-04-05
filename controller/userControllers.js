const User = require("../models/User");

const signUp = async (req, res, next) => {
    try {
        const {
            username,
            email,
            password
        } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: [
                    'Email or password cannot be blank'
                ]
            });
        }

        const existedUser = await User.findOne({
            email
        })

        if (existedUser) {
            return res.status(400).json({
                success: false,
                error: [
                    'Please enter a valid email and password to sign up'
                ]
            });
        }

        const createdUser = await new User({
            username,
            email,
            password
        }).save()

        return res.redirect("/login");

    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);

            return res.status(400).json({
                success: false,
                error: messages
            });
        }

        return res.status(500).json({
            success: false,
            error: [
                'Internal Server Error'
            ]
        });
    }
}

const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find({})

        return res.status(200).json({
            success: true,
            data: users
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            data: [],
            error: [
                "Internal Server Error"
            ]
        });
    }
}

const getUserByID = async (req, res, next) => {
    try {
        const {id} = req.params;

        const user = await User.findById(id);

        return res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            data: [],
            error: [
                "Internal Server Error"
            ]
        });
    }
}

module.exports = {
    signUp,
    getUserByID,
    getAllUsers
}