const db = require('../../../config/db.config');
const jwt = require('jsonwebtoken');
const ejs = require('ejs');
const fs = require('fs');
const path = require('path');
const User = require('../models/user');
//const authenticateToken = require('../../../middleware/authMiddleware');

exports.index = (req, res) => {
  res.render('profile.ejs',{ user: req.userData});
};

exports.profile = (req, res) => {
  
  User.findById(req.userId, (err, results) => {
    if (err) {
        console.error('Error fetching user:', err);
        return res.status(500).send('Error fetching user');
    } else {
        res.render('../../layout', { 
          title: 'Profile', 
          user: req.userData,
          body: ejs.render(fs.readFileSync(path.join(__dirname, '../views', 'profile.ejs'), 'utf8'), { user: results})
        });
    }
});


  // res.render('teachers.ejs',{ user: req.user, teachers: teachers});
};

exports.updateProfile = (req, res) => {
  const user = {
    id: req.userId,
    fullname: req.body.fullname,
    email: req.body.email,
    sdt: req.body.sdt
  }
  User.update(user, (err, results) => {
    if (err) {
        console.error('Error fetching user:', err);
        return res.status(500).send('Error fetching user');
    } else {
        res.render('../../layout', { 
          title: 'Profile', 
          user: req.userData,
          body: ejs.render(fs.readFileSync(path.join(__dirname, '../views', 'profile.ejs'), 'utf8'), { user: results})
        });
    }
  });
}