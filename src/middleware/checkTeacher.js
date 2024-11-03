const jwt = require('jsonwebtoken')
const path = require('path');
const Category = require('./getCate')
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const verifyTeacher = (req,res,next) => {
    const token = req.cookies.accessToken
    Category.findALL({}, (err, results) => {
        if (err) {
            console.error('Error fetching findCategories:', err);
        }
        req.categories = results;
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
    })

}

module.exports = verifyTeacher