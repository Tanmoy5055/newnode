const jwt = require('jsonwebtoken');
const User = require('../model/user');

const logAuth = async (req, res, next) => {
    try{
        const cookie = req.cookies.jwt;
        const decode = jwt.verify(cookie, 'abc');
        const test = await User.findOne({
            _id: decode._id
        });

        req.test = test;
        next();

    }catch(err){
        console.log(err.messege);
    }
}

module.exports = logAuth;


