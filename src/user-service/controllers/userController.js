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

exports.success = (req, res) => {
  res.render('../../layout', { 
    title: 'success', 
    user: req.userData,
    body: ejs.render(fs.readFileSync(path.join(__dirname, '../views', 'transResult.ejs'), 'utf8'), {})
  });
};

exports.profile = (req, res) => {
  
  User.findById(req.userId, (err, results) => {
    if (err) {
        console.error('Error fetching user:', err);
        return res.status(500).send('Error fetching user');
    } else {
        User.getProgressByStudentId(req.userId, (err, progress) => {
          if (err) {
              console.error('Error fetching progress:', err);
              return res.status(500).send('Error fetching progress');
          } else {
              res.render('../../layout', { 
                title: 'Profile', 
                user: req.userData,
                body: ejs.render(fs.readFileSync(path.join(__dirname, '../views', 'profile.ejs'), 'utf8'), { user: results, progress: progress})
              });
            }
        });
      }
  });
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

exports.qrcode = (req, res) => {
  
  User.findById(req.userId, (err, results) => {
    if (err) {
        console.error('Error fetching user:', err);
        return res.status(500).send('Error fetching user');
    } else {
        res.render('../../layout', { 
          title: 'Qrcode', 
          user: req.userData,
          body: ejs.render(fs.readFileSync(path.join(__dirname, '../views', 'qrcode.ejs'), 'utf8'), { user: results})
        });
    }
  });
};

exports.transfer = (req, res) => {
  const { value, date, content } = req.body;
  trans = {
    User_id: req.userId,
    Amount: value,
    Transaction_type: 'deposit',
    Transaction_date: date, 
    Note: content
  }
  User.transaction(trans, (err, results) => {
    if (err) {
        console.error('Error fetching transaction:', err);
        return res.status(500).send('Error fetching transaction');
    } else {
      User.updateBalance({id: req.userId,amount: value}, (err, results) => {
        if (err) {
            console.error('Error fetching transaction:', err);
            return res.status(500).send('Error fetching transaction');
        } else {
          res.status(200).json({ message: 'Transaction successful' });
        }
      });
    }
  });
};

exports.joinCourses = (req, res) => {
  const { course_id, amount } = req.body;
  join = {
    Student_id: req.userId,
    Amount: amount,
    Course_id: course_id
  }
  User.joinCourse(join, (err, resultsJoin) => {
    if (err) {
        console.error('Error fetching joinCourse:', err);
        return res.status(500).send('Error fetching joinCourse');
    } else {
      User.pay(join, (err, resultsPay) => {
        if (err) {
            console.error('Error fetching transaction:', err);
            return res.status(500).send('Error fetching pay');
        } else {
          const now = new Date();
          const formattedDate = now.toISOString().slice(0, 19).replace('T', ' ');
          trans = {
            User_id: req.userId,
            Amount: amount,
            Transaction_type: 'purchase',
            Transaction_date: formattedDate,
            Note: 'join to course '+ course_id
          }
          User.transaction(trans, (err, resultsPay) => {
            if (err) {
                console.error('Error fetching transaction:', err);
                return res.status(500).send('Error fetching pay');
            } else {
              res.send(`
                <script>
                    alert('Join to Course successful');
                    window.location.href = '/home/courses';
                </script>
            `);
            }
          });
        }
      });
    }
  });
};

exports.updateProgressLessons = (req, res) => {
  const progressLesson = {
    Student_id: req.userId,
    Course_id: req.body.Course_id,
    Track_lessons: req.body.Track_lessons,
  }
  User.updateProgressLessons(progressLesson, (err, results) => {
    if (err) {
        console.error('Error fetching progressLesson:', err);
        return res.status(500).send('Error fetching progressLesson');
    } else {
        console.log("cập nhật tiến trình bài học thành công!")
    }
  });
}