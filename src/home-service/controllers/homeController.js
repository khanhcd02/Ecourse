const db = require('../../../config/db.config');
const jwt = require('jsonwebtoken');
const ejs = require('ejs');
const fs = require('fs');
const path = require('path');
const Teacher = require('../models/teachers');
const Course = require('../models/courses');
//const authenticateToken = require('../../../middleware/authMiddleware');

exports.home = (req, res) => {
  res.render('../../layout', { 
    title: 'Home', 
    user: req.user,
    categories: req.categories,
    body: ejs.render(fs.readFileSync(path.join(__dirname, '../views', 'index.ejs'), 'utf8'), { user: req.user })
  });

};

exports.teachers = (req, res) => {
  Teacher.findAll((err, results) => {
    if (err) {
        console.error('Error fetching teachers:', err);
        let teachers =null;
        res.render('../../layout', { 
          title: 'Teachers', 
          user: req.user,
          categories: req.categories,
          body: ejs.render(fs.readFileSync(path.join(__dirname, '../views', 'teachers.ejs'), 'utf8'), { teachers: teachers })
        });
    } else {
        let teachers = results
        res.render('../../layout', { 
          title: 'Teachers', 
          user: req.user,
          categories: req.categories,
          body: ejs.render(fs.readFileSync(path.join(__dirname, '../views', 'teachers.ejs'), 'utf8'), { teachers: teachers })
        });
    }
});

  // res.render('teachers.ejs',{ user: req.user, teachers: teachers});
};

exports.courses = (req, res) => {  
  const page = parseInt(req.query.page) || 1; 
  const perPage = parseInt(req.query.perPage) || 6;

  // // Tính toán vị trí bắt đầu (offset)
  const offset = (page - 1) * perPage;
  const category = req.query.category;
  const teacher = req.query.teacher;
  const keyword = req.query.keyword;
  const filters = {
    category: category === 'all' ? null : category,
    teacher: teacher === 'all' ? null : teacher,
    keyword: keyword || '', 
  };

  const pagination = { perPage, offset };
  
  let courses = null;
  Course.findAll(filters, pagination, (err, results) => {
    if (err) {
        console.error('Error fetching courses:', err);
    } 
    courses = results
    Course.countTotal(filters, (err, totalCourse) => {
      if (err) {
          console.error('Error fetching courses:', err);
      } 
      let totalPages = Math.ceil(totalCourse['Total'] / perPage);
      Teacher.findAll((err, teachers) => {
        if (err) {
            console.error('Error fetching courses:', err);
        } 
        res.render('../../layout', { 
          title: 'courses', 
          user: req.user,
          categories: req.categories,
          body: ejs.render(fs.readFileSync(path.join(__dirname, '../views', 'courses.ejs'), 'utf8'), { courses: courses, page, perPage, filters, totalPages, teachers, categories: req.categories })
        });
        
      });
    });
  });
};

exports.overviewCourse = (req, res) => {  
  Course.findById(req.params.courseId, (err, results) => {
    if (err) {
        console.error('Error fetching courses:', err);
    } else if (req.user) {
      Course.checkCourseOfStudent({Course_id: req.params.courseId, Student_id: req.user.userId}, (err, resultsCheck) => {
        if (err) {
            console.error('Error fetching courses:', err);
        } else {
            res.render('../../layout', { 
              title: 'overviewCourse', 
              user: req.user,
              categories: req.categories,
              body: ejs.render(fs.readFileSync(path.join(__dirname, '../views', 'overviewCourse.ejs'), 'utf8'), { user: req.user, course: results, check: resultsCheck })
            });
        }
      });
    } else{
      res.render('../../layout', { 
        title: 'overviewCourse', 
        user: req.user,
        categories: req.categories,
        body: ejs.render(fs.readFileSync(path.join(__dirname, '../views', 'overviewCourse.ejs'), 'utf8'), { user: req.user, course: results, check: null })
      });
    }
  });
};