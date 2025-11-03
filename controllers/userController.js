const bcrypt = require('bcrypt');
const User = require("../models/User");

const jwt = require('jsonwebtoken');


module.exports.create = async (req, res) => {
    try {
        const { password, cpassword, username, firstname, lastname } = req.body;

        if (password !== cpassword) {
            return res.status(400).json({
                message: 'password and confirm password should be same',
                success: false,
            });
        }

        const user = await User.findOne({ username });

        if (user) {
            return res.status(409).json({
                message: 'username is already taken',
                success: false,
            });
        }


        const newUser = await User.create({
            username,
            firstname,
            lastname,
            password: await bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT_ROUNDS)),
        })

        return res.status(200).json({
            message: 'loggin successful',
            success: true,
            jwtToken: jwt.sign({ _id: newUser._id }, process.env.PASSPORT_JWT_SECRET, { expiresIn: '7d' }),
        });

    } catch (error) {
        console.log(`error in creating user ${error}`);
        return res.status(500).json({
            message: 'Internal Server Error',
            success: false,
        });
    }

}


module.exports.createSession = function (req, res) {


    if (!req.user) {
        return res.status(401).json({
            message: 'Invalid Username/Password',
            success: false,
        })
    }

    return res.status(200).json({
        message: 'loggin successful',
        success: true,
        jwtToken: jwt.sign({ _id: req.user._id }, process.env.PASSPORT_JWT_SECRET, { expiresIn: '7d' }),
    })
}


module.exports.profile = async function (req, res){

    if(!req.user){
        return res.status(401).json({
            message: 'unable to find user',
            success: false
        });
    }

    return res.status(200).json(req.user);
}

module.exports.userNotFound = function (req, res){
    return res.status(401).json({
        message: 'unable to find user',
        success: false
    });
}