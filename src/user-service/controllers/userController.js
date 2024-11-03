const db = require('../../../config/db.config');
const jwt = require('jsonwebtoken');
const ejs = require('ejs');
const fs = require('fs');
const path = require('path');
const User = require('../models/user');
const Teacher = require('../models/teacher');
const Category = require('../models/category');

//const authenticateToken = require('../../../middleware/authMiddleware');

exports.index = (req, res) => {
  res.render('profile.ejs',{ user: req.userData});
};

exports.success = (req, res) => {
  res.render('../../layout', { 
    title: 'success', 
    user: req.userData,
    categories: req.categories,
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
            Category.findALL({}, (err, resultsCate) => {
              if (err) {
                  console.error('Error fetching Category:', err);
                  return res.status(500).send('Error fetching Category');
              } else {
                  global.categories = resultsCate;
                  res.render('../../layout', { 
                    title: 'Profile', 
                    user: req.userData,
                    categories: req.categories,
                    body: ejs.render(fs.readFileSync(path.join(__dirname, '../views', 'profile.ejs'), 'utf8'), { user: results, progress: progress})
                  });
                }
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
          categories: req.categories,
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
          categories: req.categories,
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
  const { course_id, amount, teacher_id } = req.body;
  join = {
    Student_id: req.userId,
    Amount: amount,
    Course_id: course_id
  }
  if (amount > req.user.Balance) {
    return res.send(`
          <script>
              alert('Có đủ tiền đâu mà đăng ký!');
              window.location.href = '/user/qrcode';
          </script>
      `);
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
              User.updateBalance({id: teacher_id,amount: amount}, (err, upBalance) => {
                if (err) {
                    console.error('Error fetching updateBalance:', err);
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
        return res.status(200).json({ success: true, message: 'Mở khóa thành công bài học kế tiếp!', newTrackLessons: progressLesson.Track_lessons });
    }
  });
}

exports.Learning = (req, res) => {
  const course_id = req.params.courseId;
  const check = {
    Student_id: req.userId,
    Course_id: course_id
  }
  User.checkCourseOfStudent(check,(err, results) => {
    if (err) {
        console.error('Error fetching courses:', err);
        return res.status(500).send('Server error');
    } else {
      if(results){
        User.findLessons(course_id, (err, resultsLesson) => {
          if (err) {
              console.error('Error fetching lesson:', err);
              return res.status(500).send('Server error');
          }
          User.findExams(course_id,(err, resultsExam) => {
              if (err) {
                  console.error('Error fetching exam:', err);
                  return res.status(500).send('Server error');
              } else {
                  res.render('../../layout', { 
                    title: 'courses', 
                    user: req.userData,
                    categories: req.categories,
                    body: ejs.render(fs.readFileSync(path.join(__dirname, '../views', 'courseDetail.ejs'), 'utf8'), { lessons: resultsLesson, exams: resultsExam, progress: results })
                  });
              }
            });
      });
      }else{
        res.redirect("/home/")
      }
    }
  });

};

exports.startLesson = (req, res) => {
  const {course_id, lesson_id, ordinal_number, max_ordinal} = req.body;
  const lesson = {
    Course_id: course_id,
    Ordinal_number: ordinal_number
  }
  User.checkCourseOfStudent({Student_id: req.userId, Course_id: course_id},(err, checkResult) => {
    if (err) {
        console.error('Error fetching courses:', err);
        return res.status(500).send('Server error');
    } else {
      if(checkResult){
        User.findLessonByOrdinal(lesson,(err, results) => {
          if (err) {
            console.error('Error fetching lesson:', err);
            return res.status(500).send('Server error');
          }
          res.render('../../layout', { 
            title: 'lesson', 
            user: req.userData,
            categories: req.categories,
            body: ejs.render(fs.readFileSync(path.join(__dirname, '../views', 'lessonDetail.ejs'), 'utf8'), { lesson: results, max_ordinal, track_lessons: checkResult.Track_lessons, course_id })
          });
        })
      }
    }
  })
};

exports.requestTeacherRole = (req, res) => {
  const Certification = req.file.filename;
  const request = {
    User_id: req.userId,
    Certification: Certification,
    Expertise: req.body.Expertise,
  }
  Teacher.checkRequireTeacher(req.userId, (err, resultCheck) => {
    if (err) {
        console.error('Error fetching checkRequireTeacher:', err);
        return res.status(500).send('Error fetching checkRequireTeacher');
    } else {
      if (resultCheck) {
        Teacher.requestRole(request, (err, resultCheck) => {
          if (err) {
              console.error('Error fetching requestRole:', err);
              return res.status(500).send('Error fetching requestRole');
          } else {
            res.redirect("/user/reqTeacher")
          }
        });
      } else {
        res.send(`
          <script>
              alert('Không đủ điều kiện!');
              window.location.href = '/user/reqTeacher';
          </script>
      `);
      }
    }
  });
}

exports.checkRequestTeacher = (req, res) => {
  const id = req.userId
  Teacher.checkRequestResult({id: id}, (err, resultCheck) => {
    if (err) {
        console.error('Error fetching checkRequestResult:', err);
        return res.status(500).send('Error fetching checkRequestResult');
    } else {
      res.render('../../layout', { 
        title: 'checkRequestResult', 
        user: req.userData,
        categories: req.categories,
        body: ejs.render(fs.readFileSync(path.join(__dirname, '../views', 'checkReq.ejs'), 'utf8'), { checks: resultCheck, role: req.userData.Role })
      });
    }
  })
}

exports.checkTrans = (req, res) => {
  const id = req.userId
  User.checkTrans(id, (err, resultCheck) => {
    if (err) {
        console.error('Error fetching checkRequestResult:', err);
        return res.status(500).send('Error fetching checkRequestResult');
    } else {
      res.render('../../layout', { 
        title: 'check trans', 
        user: req.userData,
        categories: req.categories,
        body: ejs.render(fs.readFileSync(path.join(__dirname, '../views', 'checkTrans.ejs'), 'utf8'), { checks: resultCheck})
      });
    }
  })
}