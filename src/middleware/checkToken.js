const jwt = require('jsonwebtoken')
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const verifyToken = (req,res,next) => {
    const token = req.cookies.accessToken

    if(!token) return res.redirect("/home/");

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        req.userId = decoded.userId
        req.userData = decoded
        next()
    } catch (error) {
        console.log(error)
        res.redirect("/home/");
    }
}

module.exports = verifyToken