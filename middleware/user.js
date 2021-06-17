const jwt = require('jsonwebtoken');
const User = require('../model/user');

const requireAuth = async (req, res, next) => {
    
    const token = req.cookies.jwt;
      
        if (token) {
          const decoded = jwt.verify(token, 'abc');
          const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })
      
          if (!user) {
            res.redirect('/login');
          }
      
          // For specific Logout
          req.token = token;
          req.user = user;
          next();
        } else {
          res.redirect('/login');
        }

  
}

module.exports = requireAuth;


