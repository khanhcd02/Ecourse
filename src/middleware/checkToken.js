const jwt = require('jsonwebtoken')
const path = require('path');
const Category = require('./getCate')
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const verifyToken = (req,res,next) => {
    const token = req.cookies.accessToken
    Category.findALL({}, (err, results) => {
        if (err) {
            console.error('Error fetching findCategories:', err);
        }
        req.categories = results;
        if(!token) return res.redirect("/home/");

        try {
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
            req.userId = decoded.userId
            req.userData = decoded
            req.user = decoded
            next()
        } catch (error) {
            console.log(error)
            res.redirect("/home/");
        }
    })
    
}

module.exports = verifyToken