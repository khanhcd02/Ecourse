const db = require('../../../config/db.config');

const Course = {
    approveRequestCourse: (Course_id, callback) => {
        const query = 'UPDATE courses SET Status = ? where Id = ?';
        db.query(query, ['Approve', Course_id], (err, results) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, results[0] );
        });
    },

    rejectRequestCourse: (Course_id, callback) => {
        const query = 'UPDATE courses SET Status = ? where Id = ?';
        db.query(query, ['Draft', Course_id], (err, results) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, results[0] );
        });
    },

    checkRequestCourse: (req, callback) => {
        const query = 'SELECT * FROM doanweb.courses WHERE Status = ?';
        db.query(query, ['Pending'], (err, results) => {
            if (err) {
            return callback(err, null);
            }
            callback(null, results);
        });
    },

    findLessonById: (Course_id, callback) => {
        const query = 'SELECT * FROM doanweb.lessons WHERE Course_id = ?';
        db.query(query, [Course_id], (err, results) => {
            if (err) {
            return callback(err, null);
            }
            callback(null, results);
        });
    },

    findExamById: (Course_id, callback) => {
        const query = 'SELECT * FROM doanweb.exams WHERE Course_id = ?';
        db.query(query, [Course_id], (err, results) => {
            if (err) {
            return callback(err, null);
            }
            callback(null, results);
        });
    },

    demoExam: (Exam_id, callback) => {
        const query = 'SELECT * FROM doanweb.exam_detail WHERE Exam_id = ?';
        db.query(query, [Exam_id], (err, results) => {
            if (err) {
            return callback(err, null);
            }
            callback(null, results);
        });
    },
}
module.exports = Course;