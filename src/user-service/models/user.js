// models/User.js
const db = require('../../../config/db.config');

const User = {

  findById: (id, callback) => {
    const query = 'SELECT * FROM users WHERE Id = ?';
    db.query(query, [id], (err, results) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, results[0]);
    });
  },

  getProgressByStudentId: (id, callback) => {
    const query = 'SELECT e.*, c.Name_course FROM enrollments e JOIN courses c ON e.Course_id = c.Id WHERE Student_id = ?';
    db.query(query, [id], (err, results) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, results);
    });
  },

  

  update: (user, callback) => {
  const query = 'UPDATE users SET Fullname = ?, Email = ?, Phone_number = ? WHERE Id = ? VALUES (?, ?, ?, ?, ?)';
    db.query(query, [user.fullname, user.email, user.phone_number, user.id], (err, results) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, { ...user });
    });
  },

  transaction: (transaction, callback) => {
    const query = 'INSERT INTO transactions(User_id,Amount,Transaction_type,Transaction_date, Note) VALUES (?, ?, ?, ?, ?)';
      db.query(query, [transaction.User_id, transaction.Amount, transaction.Transaction_type, transaction.Transaction_date, transaction.Note], (err, results) => {
        if (err) {
          return callback(err, null);
        }
        callback(null, results[0] );
      });
    },

  updateBalance: (trans, callback) => {
    const query = 'UPDATE users SET Balance = Balance + ? WHERE Id = ?';
      db.query(query, [trans.amount, trans.id], (err, results) => {
        if (err) {
          return callback(err, null);
        }
        callback(null, results[0]);
      });
    },
    

  joinCourse: (join, callback) => {
    const query = 'INSERT INTO enrollments(Student_id,Course_id,Status) VALUES (?, ?, ?)';
      db.query(query, [join.Student_id,join.Course_id,'registed'], (err, results) => {
        if (err) {
          return callback(err, null);
        }
        callback(null, results[0]);
      });
  },

  pay: (trans, callback) => {
    const query = 'UPDATE users SET Balance = Balance - ? WHERE Id = ?';
      db.query(query, [trans.Amount, trans.Student_id], (err, results) => {
        if (err) {
          return callback(err, null);
        }
        callback(null, results[0]);
      });
    },

  updateProgressLessons: (progress, callback) => {
    const query = 'UPDATE enrollments SET Track_lessons = ? WHERE Student_id = ? AND Course_id = ? AND Status = ?';
      db.query(query, [progress.Track_lessons, progress.Student_id, progress.Course_id, 'registed'], (err, results) => {
        if (err) {
          return callback(err, null);
        }
        callback(null, results[0]);
      });
    },

    findLessons: (course_id, callback) => {
      const query = 'SELECT * FROM lessons WHERE Course_id = ? ORDER BY (Ordinal_number) ASC';
      db.query(query, [course_id], (err, results) => {
        if (err) {
          return callback(err, null);
        }
        callback(null, results);
      });
    },

    findLessonByOrdinal: (lesson, callback) => {
      const query = 'SELECT * FROM lessons WHERE Course_id = ? AND Ordinal_number = ?';
      db.query(query, [lesson.Course_id, lesson.Ordinal_number], (err, results) => {
        if (err) {
          return callback(err, null);
        }
        callback(null, results[0]);
      });
    },
    
    findExams: (course_id, callback) => {
      const query = 'SELECT * FROM exams WHERE Course_id = ?';
      db.query(query, [course_id], (err, results) => {
        if (err) {
          return callback(err, null);
        }
        callback(null, results);
      });
    },

    checkCourseOfStudent: (check, callback) => {
      const query = 'SELECT * FROM enrollments WHERE Student_id = ? AND Course_id = ? AND (Status = ? OR Status = ?)';
      db.query(query, [check.Student_id, check.Course_id, 'registed', 'completed'], (err, results) => {
        if (err) {
          return callback(err, null);
        }
        callback(null, results[0]);
      });
    },
}

module.exports = User;
