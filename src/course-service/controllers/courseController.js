const db = require('../../../config/db.config');
const jwt = require('jsonwebtoken');
const ejs = require('ejs');
const fs = require('fs');
const path = require('path');
const Course = require('../models/course');

exports.courses = (req, res) => {  
  if(req.user.Role == 'teacher'){
    Course.findOfMySelf(req.user.userId,(err, results) => {
        if (err) {
            console.error('Error fetching courses:', err);
            results = null;
        } 
        res.render('../../layout', { 
            title: 'courses', 
            user: req.user,
            categories: req.categories,
            body: ejs.render(fs.readFileSync(path.join(__dirname, '../views', 'courses.ejs'), 'utf8'), { courses: results })
        });
      });
  }else{
    res.redirect('/home/');
  }
};

exports.addCourses = (req, res) => { 
    if (req.method === 'GET') {
        res.render('../../layout', { 
            title: 'add courses', 
            user: req.user,
            categories: req.categories,
            body: ejs.render(fs.readFileSync(path.join(__dirname, '../views', 'addCourse.ejs'), 'utf8'), { categories: req.categories })
        });
    }else if (req.method === 'POST') {
        const { Name_course, Category_id, Tuition, Duration, Describe } = req.body;
        const Image = req.file ? req.file.filename : 'course-1.jpg';
        const Teacher_id = req.user.userId;
        const newCourse = {
            Name_course,
            Category_id,
            Teacher_id,
            Tuition,
            Duration,
            Describe,
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
                      categories: req.categories,
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
        res.render('../../layout', { 
            title: 'add lesson', 
            user: req.user,
            categories: req.categories,
            body: ejs.render(fs.readFileSync(path.join(__dirname, '../views', 'addLesson.ejs'), 'utf8'), { courseId: req.params.courseId })
        });
    }else if (req.method === 'POST') {
        const { Title, Course_id, Content } = req.body;
        const newLesson = {
            Title, 
            Course_id, 
            Content
        }
        Course.addNewLesson(newLesson, (err, result) => {
            if (err) {
                console.error('Error adding course:', err);
                return res.status(500).send('Server error');
            }
            res.redirect(`/courses/${Course_id}`);
        });
    }
};

exports.updateLesson = (req, res) => { 
    if (req.method === 'GET') {
        Course.checkDuplicateLesson(req.params.lessionId, (err, result) => {
            if (err) {
                console.error('Error check Duplicate Lesson:', err);
                return res.status(500).send('Server error');
            }
            if(result.length == 0){
                Course.duplicateLesson(req.params.lessionId, (err, duplicate_result) => {
                    if (err) {
                        console.error('Error Duplicate Lesson:', err);
                        return res.status(500).send('Server error');
                    }
                    res.render('../../layout', { 
                        title: 'update lesson', 
                        user: req.user,
                        categories: req.categories,
                        body: ejs.render(fs.readFileSync(path.join(__dirname, '../views', 'updateLesson.ejs'), 'utf8'), { courseId: req.params.courseId, lesson: duplicate_result })
                    });
                });
            }else{
                res.render('../../layout', { 
                    title: 'update lesson', 
                    user: req.user,
                    categories: req.categories,
                    body: ejs.render(fs.readFileSync(path.join(__dirname, '../views', 'updateLesson.ejs'), 'utf8'), { courseId: req.params.courseId, lesson: result[0] })
                });
            }
        });

    }else if (req.method === 'POST') {
        const { Title, Content, Status, Old_content } = req.body;
        const uLesson = {
            Lesson_id: req.params.lessionId,
            Title, 
            Content: Content || Old_content,
            Status
        }
        Course.updateLesson(uLesson, (err, result) => {
            if (err) {
                console.error('Error adding course:', err);
                return res.status(500).send('Server error');
            }
            res.redirect(`/courses/`);
        });
    }
};

exports.addExam = (req, res) => { 
    if (req.method === 'GET') {
        res.render('../../layout', { 
            title: 'add exam', 
            user: req.user,
            categories: req.categories,
            body: ejs.render(fs.readFileSync(path.join(__dirname, '../views', 'addExam.ejs'), 'utf8'), { courseId: req.params.courseId })
        });
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
            res.redirect(`/courses/${Course_id}`);
        });
    }
};

exports.addExamDetail = (req, res) => {
    if (req.method === 'GET') {
        res.render('../../layout', { 
            title: 'add question', 
            user: req.user,
            categories: req.categories,
            body: ejs.render(fs.readFileSync(path.join(__dirname, '../views', 'addQuestion.ejs'), 'utf8'), { examId: req.params.examId })
        });
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

exports.updateLessonsOrder = (req, res) => { 
    const lessons = req.body.lessons;
    Course.updateLessonsOrder(lessons, (err, result) => {
        if (err) {
            console.error('Error:', err);
            return res.status(500).send('Server error');
        }
        return res.status(200).json({ message: 'Lessons order updated successfully', data: result });
    });
};

exports.updateExamsOrder = (req, res) => { 
    const exams = req.body.exams;
    Course.updateExamsOrder(exams, (err, result) => {
        if (err) {
            console.error('Error:', err);
            return res.status(500).send('Server error');
        }
        return res.status(200).json({ message: 'Exams order updated successfully', data: result });
    });
};

exports.reqCourse = (req, res) => { 
    const Course_id = req.body.Course_id;
    Course.reqCourse(Course_id, (err, result) => {
        if (err) {
            console.error('Error:', err);
            return res.status(500).send('Server error');
        }
        res.redirect('/courses')
    });
};