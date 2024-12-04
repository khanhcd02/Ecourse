const db = require('../../../config/db.config');
const jwt = require('jsonwebtoken');
const ejs = require('ejs');
const dayjs = require('dayjs');
const fs = require('fs');
const path = require('path');
const Course = require('../models/course');
const Teacher = require('../models/teacher');
const Stats = require('../models/stats')
const Category = require('../models/category')

exports.getReqTeacher = (req, res) => {  
    Teacher.checkRequestRole({},(err, results) => {
        if (err) {
            console.error('Error fetching getReqTeacher:', err);
        } 
        res.render('../../adminLayout', { 
            title: 'Request Teacher', 
            user: req.user,
            body: ejs.render(fs.readFileSync(path.join(__dirname, '../views', 'teacherRequest.ejs'), 'utf8'), { requests: results })
        });
    });
};

exports.getReqCourse = (req, res) => {  
    Course.checkRequestCourse({},(err, results) => {
        if (err) {
            console.error('Error fetching checkRequestCourse:', err);
        } 
        res.render('../../adminLayout', { 
            title: 'Request Course', 
            user: req.user,
            body: ejs.render(fs.readFileSync(path.join(__dirname, '../views', 'courseRequest.ejs'), 'utf8'), { courses: results })
        });
    });
};

exports.getReqUpdate = (req, res) => {  
    Course.checkRequestLesson({},(err, results) => {
        if (err) {
            console.error('Error fetching checkRequestLesson:', err);
        } 
        res.render('../../adminLayout', { 
            title: 'Request Update', 
            user: req.user,
            body: ejs.render(fs.readFileSync(path.join(__dirname, '../views', 'updateRequest.ejs'), 'utf8'), { lessons: results })
        });
    });
};

exports.dashboard = (req, res) => {  
    Stats.getReceipts({},(err, results) => {
        if (err) {
            console.error('Error fetching getReqTeacher:', err);
        } 
        const totalsByDate = results.reduce((acc, receipt) => {
            const date = dayjs(receipt.Transaction_date).format('YYYY-MM-DD');
            if (!acc[date]) {
                acc[date] = 0;
            }
            acc[date] += receipt.Amount;
            return acc;
        }, {});

        // Chuyển đổi sang mảng cho AmCharts
        const formattedData = Object.keys(totalsByDate).map(date => ({
            date: date,
            value: totalsByDate[date]
        }));
        
        const monthStats = {};

        results.forEach(item => {
            const month = dayjs(item.Transaction_date).format('YYYY-MM');
            const amount = item.Amount;

            if (!monthStats[month]) {
                monthStats[month] = 0;
            }
            monthStats[month] += amount;
        });

        const formattedDataByMonth = Object.keys(monthStats).map(month => ({
            date: month + '-30',
            value: monthStats[month]
        }));
        Stats.getUsers({},(err, resultsUsers) => {
            if (err) {
                console.error('Error fetching getReqTeacher:', err);
            } 
            res.render('../../adminLayout', { 
                title: 'Dashboard', 
                user: req.user,
                body: ejs.render(fs.readFileSync(path.join(__dirname, '../views', 'dashboard.ejs'), 'utf8'), { formattedData: JSON.stringify(formattedData), formattedDataByMonth: JSON.stringify(formattedDataByMonth), totalRole: resultsUsers})
            });
        })

    });
};

exports.resolveReqTeacher = (req, res) => { 
    const action = req.body.action;
    const Req_id = req.body.Req_id;
    const User_id = req.body.User_id;
    if (action === 'approve') {
        Teacher.checkRequireTeacher({id: User_id},(err, resultsCheck) => {
            if (err) {
                console.error('Error fetching checkRequireTeacher:', err);
            } 
            if (resultsCheck) {
                Teacher.pay({Amount: 20000, User_id: User_id},(err, resultsPay) => {
                    if (err) {
                        console.error('Error fetching pay:', err);
                    }
                    if (resultsPay) {
                        trans = {
                            User_id: User_id,
                            Amount: 20000,
                            Transaction_type: 'purchase',
                            Transaction_date: dayjs().format('YYYY-MM-DD HH:mm:ss'), 
                            Note: 'Phí nâng cấp thành viên'
                          } 
                        Teacher.transaction(trans,(err, resultsTrans) => {
                            if (err) {
                                console.error('Error fetching approveRequestRole:', err);
                            } 
                            Teacher.approveRequestRole(Req_id,(err, resultsApproved) => {
                                if (err) {
                                    console.error('Error fetching approveRequestRole:', err);
                                } 
                                res.redirect('/admin/getReqTeacher')
                            });
                        });
                    }
                });
            }
            
        });
    } else if (action === 'reject') {
        Teacher.rejectRequestRole(Req_id,(err, results) => {
            if (err) {
                console.error('Error fetching rejectRequestRole:', err);
            } 
            res.redirect('/admin/getReqTeacher')
        });
    }
    
};

exports.resolveReqCourse = (req, res) => { 
    const action = req.body.action;
    const Course_id = req.body.Course_id;
    if (action === 'approve') {
        Course.approveRequestCourse(Course_id,(err, resultsCheck) => {
            if (err) {
                console.error('Error fetching checkRequireTeacher:', err);
            } 
            res.redirect('/admin/getReqCourse')
            
        });
    } else if (action === 'reject') {
        Course.rejectRequestCourse(Course_id,(err, results) => {
            if (err) {
                console.error('Error fetching rejectRequestRole:', err);
            } 
            res.redirect('/admin/getReqCourse')
        });
    }
    
};

exports.resolveReqUpdate = (req, res) => { 
    const action = req.body.action;
    const Lesson_id = req.body.Lesson_id;
    if (action === 'approve') {
        Course.approveRequestUpdate(Lesson_id,(err, resultsCheck) => {
            if (err) {
                console.error('Error fetching approveRequestUpdate:', err);
            }
            Course.merge(Lesson_id,(err, results) => {
                if (err) {
                    console.error('Error fetching approveRequestUpdate:', err);
                } 
                res.redirect('/admin/getReqUpdate')
            });
        });
    } else if (action === 'reject') {
        Course.rejectRequestUpdate(Lesson_id,(err, results) => {
            if (err) {
                console.error('Error fetching rejectRequestUpdate:', err);
            } 
            res.redirect('/admin/getReqUpdate')
        });
    }
    
};

exports.checkCourse = (req, res) => {  
    const Course_id = req.params.Course_id;
    Course.findLessonById(Course_id,(err, resultsLesson) => {
        if (err) {
            console.error('Error fetching getReqTeacher:', err);
        } 
        Course.findExamById(Course_id,(err, resultsExam) => {
            if (err) {
                console.error('Error fetching getReqTeacher:', err);
            } 
            res.render('../../adminLayout', { 
                title: 'Check Course', 
                user: req.user,
                body: ejs.render(fs.readFileSync(path.join(__dirname, '../views', 'checkCourse.ejs'), 'utf8'), { lessons: resultsLesson, exams: resultsExam })
            });
        });
    });
};

exports.checkLesson = (req, res) => {  
    const Lesson_id = req.params.Lesson_id;
    Course.findLessonDetailById(Lesson_id,(err, resultsLesson) => {
        if (err) {
            console.error('Error fetching getReqTeacher:', err);
        } 
        res.render('../../adminLayout', { 
            title: 'Check Lesson', 
            user: req.user,
            body: ejs.render(fs.readFileSync(path.join(__dirname, '../views', 'checkLesson.ejs'), 'utf8'), { lesson: resultsLesson})
        });
    });
};

exports.checkUpdateLesson = (req, res) => {  
    const Lesson_id = req.params.Lesson_id;
    Course.findLessonDetailById(Lesson_id,(err, Old_lesson) => {
        if (err) {
            console.error('Error fetching checkUpdateLesson:', err);
        } 
        Course.getUpdateLessonById(Lesson_id,(err, updateLesson) => {
            if (err) {
                console.error('Error fetching getUpdateLessonById:', err);
            } 
            res.render('../../adminLayout', { 
                title: 'Check Lesson', 
                user: req.user,
                body: ejs.render(fs.readFileSync(path.join(__dirname, '../views', 'checkUpdateLesson.ejs'), 'utf8'), { Old_lesson: Old_lesson, lesson: updateLesson})
            });
        });
    });
};

exports.checkExam = (req, res) => {  
    const Exam_id = req.params.Exam_id;
    Course.demoExam(Exam_id,(err, results) => {
        if (err) {
            console.error('Error fetching getReqTeacher:', err);
        } 
        res.render('../../adminLayout', { 
            title: 'Check Exam', 
            user: req.user,
            body: ejs.render(fs.readFileSync(path.join(__dirname, '../views', 'checkExam.ejs'), 'utf8'), { questions: results })
        });
    });
};

exports.getCategories = (req, res) => {  
    Category.getCategories((err, results) => {
        if (err) {
            console.error('Error fetching getReqTeacher:', err);
        } 
        res.render('../../adminLayout', { 
            title: 'Categories', 
            user: req.user,
            body: ejs.render(fs.readFileSync(path.join(__dirname, '../views', 'categories.ejs'), 'utf8'), { categories: results })
        });
    });
};

exports.addCategory = (req, res) => {
    const c_name = req.body.Category_name;
    Category.addCategory(c_name,(err, results) => {
        if (err) {
            console.error('Error fetching getReqTeacher:', err);
        } 
        return res.redirect('/admin/categories')
    });
};

exports.updateCategory = (req, res) => {  
    const c_id = req.body.category_id;
    const c_name = req.body.category_name;
    Category.updateCategory({Id: c_id, Category_name: c_name},(err, results) => {
        if (err) {
            res.status(400).json({ message: 'Category not found' });
        } 
        res.status(200).json({ message: 'Category updated successfully' });
    });
};

exports.updateStatus = (req, res) => {  
    const c_id = req.body.category_id;
    const status = req.body.status;
    Category.updateStatus({Id: c_id, Status: status},(err, results) => {
        if (err) {
            res.status(400).json({ message: 'Category not found' });
        } 
        res.status(200).json({ message: 'Category updated successfully' });
    });
};