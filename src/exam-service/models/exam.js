// models/User.js
const db = require('../../../config/db.config');

const Exam = {

  findAll: (course_id, callback) => {
    const query = 'SELECT * FROM exams';
    db.query(query, [course_id], (err, results) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, results);
    });
  },

  getExam: (examId, callback) => {
    const query = 'SELECT * FROM exam_detail WHERE Exam_id = ?';
    db.query(query, [examId], (err, results) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, results);
    });
  },

  findById: (examId, callback) => {
    const query = 'SELECT * FROM exams WHERE Id = ?';
    db.query(query, [examId], (err, results) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, results[0]);
    });
  },

}

module.exports = Exam;
