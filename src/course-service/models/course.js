// models/User.js
const db = require('../../../config/db.config');

const Course = {

  findOfMySelf: (teacher_id, callback) => {
    const query = 'SELECT * FROM courses WHERE Teacher_id = ?';
    db.query(query, [teacher_id], (err, results) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, results);
    });
  },

  findLesson: (course_id, callback) => {
    const query = 'SELECT * FROM lessons WHERE Course_id = ?';
    db.query(query, [course_id], (err, results) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, results);
    });
  },
  
  findExam: (course_id, callback) => {
    const query = 'SELECT * FROM exams WHERE Course_id = ?';
    db.query(query, [course_id], (err, results) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, results);
    });
  },

  create: (newCourse, callback) => {
    const query = 'INSERT INTO courses (Image, Name_course, Category_id, Teacher_id, Tuition, Duration, Status) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(query, [newCourse.Image, newCourse.Name_course, newCourse.Category_id, newCourse.Teacher_id, newCourse.Tuition, newCourse.Duration, 'Draft'], (err, results) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, results);
    });
  },

  addNewLesson: (newLesson, callback) => {
    const query = 'INSERT INTO lessons (Title, Course_id, Ordinal_number, Content) VALUES (?, ?, ?, ?)';
    db.query(query, [newLesson.Title, newLesson.Course_id, newLesson.Ordinal_number, newLesson.Content], (err, results) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, results);
    });
  },

  addNewExam: (newExam, callback) => {
    const query = 'INSERT INTO exams (Title, Course_id, Exam_time) VALUES (?, ?, ?)';
    db.query(query, [newExam.Title, newExam.Course_id, newExam.Exam_time], (err, results) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, results);
    });
  },

  addQuestion: (newQuestion, callback) => {
    const query = 'INSERT INTO exam_detail (Exam_id, Question, A, B, C, D, Answer) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(query, [newQuestion.Exam_id, newQuestion.Question, newQuestion.A, newQuestion.B, newQuestion.C, newQuestion.D, newQuestion.Answer], (err, results) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, results);
    });
  },
}

module.exports = Course;
