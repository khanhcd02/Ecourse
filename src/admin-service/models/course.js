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

    approveRequestUpdate: (Lesson_id, callback) => {
        const query = 'UPDATE duplicate_lessons SET Status = ? where Lesson_id = ?';
        db.query(query, ['Approve', Lesson_id], (err, results) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, results[0] );
        });
    },

    rejectRequestUpdate: (Lesson_id, callback) => {
        const query = 'UPDATE duplicate_lessons SET Status = ? where Lesson_id = ?';
        db.query(query, ['Draft', Lesson_id], (err, results) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, results[0] );
        });
    },

    merge: (Lesson_id, callback) => {
        const query = `
            UPDATE lessons AS l
            JOIN duplicate_lessons AS dl ON l.Id = dl.Lesson_id
            SET l.Title = dl.Title,
                l.Content = dl.Content
            WHERE l.Id = ? AND dl.Lesson_id = ?
        `;
        db.query(query, [Lesson_id, Lesson_id], (err, results) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, results[0] );
        });
    },

    checkRequestCourse: (req, callback) => {
        const query = 'SELECT c.*, ca.Category_name, u.Fullname FROM courses c join users u on u.Id = c.Teacher_id join categories ca on ca.Id = c.Category_id WHERE c.Status = ?';
        db.query(query, ['Pending'], (err, results) => {
            if (err) {
            return callback(err, null);
            }
            callback(null, results);
        });
    },

    checkRequestLesson: (req, callback) => {
        const query = 'SELECT * FROM duplicate_lessons WHERE Status = ?';
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

    findLessonDetailById: (Lesson_id, callback) => {
        const query = 'SELECT * FROM doanweb.lessons WHERE Id = ?';
        db.query(query, [Lesson_id], (err, results) => {
            if (err) {
            return callback(err, null);
            }
            callback(null, results[0]);
        });
    },

    getUpdateLessonById: (Lesson_id, callback) => {
        const query = 'SELECT * FROM doanweb.duplicate_lessons WHERE Lesson_id = ?';
        db.query(query, [Lesson_id], (err, results) => {
            if (err) {
            return callback(err, null);
            }
            callback(null, results[0]);
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