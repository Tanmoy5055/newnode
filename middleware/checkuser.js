const jwt = require('jsonwebtoken');
const User = require('../model/user');


const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
      jwt.verify(token, 'abc', async (err, decodedToken) => {
        if (err) {
          res.locals.user = null;
          next();
        } else {
          //   let user = await User.findById(decodedToken.id);
          let user = await User.findOne({ _id: decodedToken._id, 'tokens.token': token })
          res.locals.user = user;
          next();
        }
      });
    } else {
      res.locals.user = null;
      next();
    }
  };

  module.exports = checkUser;
