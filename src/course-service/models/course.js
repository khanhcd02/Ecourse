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
    const query = 'INSERT INTO courses (Image, Name_course, Category_id, Teacher_id, Tuition, Duration, Short_describe, Status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(query, ['/courses/' + newCourse.Image, newCourse.Name_course, newCourse.Category_id, newCourse.Teacher_id, newCourse.Tuition, newCourse.Duration, newCourse.Describe, 'Draft'], (err, results) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, results);
    });
  },

  addNewLesson: (newLesson, callback) => {
    const query = `
        INSERT INTO lessons (Title, Course_id, Ordinal_number, Content)
        SELECT ?, ?, IFNULL(MAX(Ordinal_number), 0) + 1, ?
        FROM lessons
        WHERE Course_id = ?
    `;
    db.query(query, [newLesson.Title, newLesson.Course_id, newLesson.Content, newLesson.Course_id], (err, results) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, results);
    });
  },

  addNewExam: (newExam, callback) => {
    const query = `
        INSERT INTO exams (Title, Course_id, Ordinal_number, Exam_time)
        SELECT ?, ?, IFNULL(MAX(Ordinal_number), 0) + 1, ?
        FROM exams
        WHERE Course_id = ?
    `;
    db.query(query, [newExam.Title, newExam.Course_id, newExam.Exam_time, newExam.Course_id], (err, results) => {
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

  updateLessonsOrder: (lessons, callback) => {
    const query = 'UPDATE lessons SET Ordinal_number = ? WHERE Id = ?';
    
    // Tạo một mảng để lưu các truy vấn
    const updates = lessons.map((lesson) => {
        return new Promise((resolve, reject) => {
            db.query(query, [lesson.newPosition, lesson.id], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    });

    // Chờ tất cả các truy vấn hoàn thành
    Promise.all(updates)
        .then(results => {
            callback(null, results); // Trả về kết quả nếu thành công
        })
        .catch(err => {
            callback(err, null); // Trả về lỗi nếu có
        });
    },

  updateExamsOrder: (exams, callback) => {
    const query = 'UPDATE exams SET Ordinal_number = ? WHERE Id = ?';
    
    // Tạo một mảng để lưu các truy vấn
    const updates = exams.map((exam) => {
        return new Promise((resolve, reject) => {
            db.query(query, [exam.newPosition, exam.id], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    });

    // Chờ tất cả các truy vấn hoàn thành
    Promise.all(updates)
        .then(results => {
            callback(null, results); // Trả về kết quả nếu thành công
        })
        .catch(err => {
            callback(err, null); // Trả về lỗi nếu có
        });
    },

}

module.exports = Course;
