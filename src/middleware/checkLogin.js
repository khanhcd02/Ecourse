const jwt = require('jsonwebtoken')
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const verifyLogin = (req,res,next) => {
    const token = req.cookies.accessToken

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
    // try {
    //     const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    //     req.userData = decoded
    //     next()
    // } catch (error) {
    //     console.log(error)
    //     return res.sendStatus(403)
    // }
}

module.exports = verifyLogin