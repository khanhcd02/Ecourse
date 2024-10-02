const db = require('../../../config/db.config');
const jwt = require('jsonwebtoken');
const ejs = require('ejs');
const fs = require('fs');
const path = require('path');
const Course = require('../models/course');
const Category = require('../models/category');

exports.courses = (req, res) => {  
  if(req.user.Role == 'teacher'){
    Course.findOfMySelf(req.user.userId,(err, results) => {
        if (err) {
            console.error('Error fetching courses:', err);
            let courses =null;
            res.render('../../layout', { 
              title: 'courses', 
              user: req.user,
              body: ejs.render(fs.readFileSync(path.join(__dirname, '../views', 'courses.ejs'), 'utf8'), { courses: courses })
            });
        } else {
            let courses = results
            res.render('../../layout', { 
              title: 'courses', 
              user: req.user,
              body: ejs.render(fs.readFileSync(path.join(__dirname, '../views', 'courses.ejs'), 'utf8'), { courses: courses })
            });
        }
      });
  }else{
    res.redirect('/home/');
  }
};

exports.addCourses = (req, res) => { 
    if (req.method === 'GET') {
        Category.findALL((err, results) => {
            if (err) {
                console.error('Error fetching Category:', err);
                res.redirect('/courses');
            } else {
                res.render('../views/addCourse.ejs',{categories: results})
            }
        })
    }else if (req.method === 'POST') {
        const { Name_course, Category_id, Tuition, Duration } = req.body;
        const Image = req.file ? req.file.filename : '/courses/course-1.jpg';
        const Teacher_id = req.user.userId;
        const newCourse = {
            Name_course,
            Category_id,
            Teacher_id,
            Tuition,
            Duration,
            Image,
        }
        Course.create(newCourse, (err, result) => {
            if (err) {
                console.error('Error adding course:', err);
                return res.status(500).send('Server error');
            }
            res.redirect('/courses');
        });
    }
}

exports.lessons = (req, res) => {  
    if(req.user.Role == 'teacher'){
        Course.findLesson(req.params.courseId, (err, resultsLesson) => {
            if (err) {
                console.error('Error adding course:', err);
                return res.status(500).send('Server error');
            }
            Course.findExam(req.params.courseId,(err, resultsExam) => {
                if (err) {
                    console.error('Error fetching courses:', err);
                    return res.status(500).send('Server error');
                } else {
                    res.render('../../layout', { 
                      title: 'courses', 
                      user: req.user,
                      body: ejs.render(fs.readFileSync(path.join(__dirname, '../views', 'courseDetail.ejs'), 'utf8'), { lessons: resultsLesson, exams: resultsExam, courseId: req.params.courseId })
                    });
                }
              });
        });
      
    }else{
      res.redirect('/home/');
    }
  };

exports.addLesson = (req, res) => { 
    if (req.method === 'GET') {
        res.render('../views/addLesson.ejs',{courseId: req.params.courseId})
    }else if (req.method === 'POST') {
        const { Title, Course_id, Ordinal_number, Content } = req.body;
        const newLesson = {
            Title, 
            Course_id, 
            Ordinal_number, 
            Content
        }
        Course.addNewLesson(newLesson, (err, result) => {
            if (err) {
                console.error('Error adding course:', err);
                return res.status(500).send('Server error');
            }
            res.redirect('/courses');
        });
    }
};

exports.addExam = (req, res) => { 
    if (req.method === 'GET') {
        res.render('../views/addExam.ejs',{courseId: req.params.courseId})
    }else if (req.method === 'POST') {
        const { Title, Course_id, Exam_time } = req.body;
        const newExam = {
            Title, 
            Course_id, 
            Exam_time
        }
        Course.addNewExam(newExam, (err, result) => {
            if (err) {
                console.error('Error adding course:', err);
                return res.status(500).send('Server error');
            }
            res.redirect('/courses');
        });
    }
};

exports.addExamDetail = (req, res) => {
    if (req.method === 'GET') {
        res.render('../views/addQuestion.ejs',{examId: req.params.examId})
    }else if (req.method === 'POST') {
        const { questions } = req.body;
        const examId = req.params.examId; // Lấy ID đề thi từ form hoặc URL
        
        if (!questions || questions.length === 0) {
            return res.status(400).send('No questions provided');
        }

        questions.forEach((question, index) => {
            const { Question, A, B, C, D, Answer } = question;
            const newQuestion = {
                Exam_id: examId,
                Question,
                A,
                B,
                C,
                D,
                Answer,
            };

            // Lưu từng câu hỏi vào database
            Course.addQuestion(newQuestion, (err, result) => {
                if (err) {
                    console.error(`Error adding question ${index + 1}:`, err);
                }
            });
        });

        res.redirect('/courses');
    }
    
};
