const jwt = require('jsonwebtoken')
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const Category = require('./getCate')
const verifyLogin = (req,res,next) => {
    const token = req.cookies.accessToken
    Category.findALL({}, (err, results) => {
      if (err) {
          console.error('Error fetching findCategories:', err);
      }
      req.categories = results;
      if(!token) {
        req.user = null;
      }
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
          req.user = null;
        }
        req.user = user;
      });
      return next();
    })
    
}

module.exports = verifyLogin