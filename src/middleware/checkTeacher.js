const jwt = require('jsonwebtoken')
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const verifyTeacher = (req,res,next) => {
    const token = req.cookies.accessToken

    if(!token) return res.redirect("/auth/login");

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        req.user = decoded
        if(decoded.Role === 'teacher'){
            next()
        }else{
            res.redirect("/home/");
        }
    } catch (error) {
        console.log(error)
        res.redirect("/home/");
    }
}

module.exports = verifyTeacher