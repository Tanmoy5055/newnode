const jwt = require('jsonwebtoken');

const notRequireAuth = async (req, res, next) => {
    try {
        const cookie = req.cookies.jwt;
        if(cookie){
            res.render('index');
        }else{
            next();
        }
    } catch(err) {
        console.log(err);
    }
}

module.exports = notRequireAuth;