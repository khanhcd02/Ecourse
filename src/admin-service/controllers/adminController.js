const db = require('../../../config/db.config');
const jwt = require('jsonwebtoken');
const ejs = require('ejs');
const dayjs = require('dayjs');
const fs = require('fs');
const path = require('path');
const Course = require('../models/course');
const Teacher = require('../models/teacher');
const Stats = require('../models/stats')

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
