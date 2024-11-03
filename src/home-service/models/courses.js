// models/User.js
const db = require('../../../config/db.config');

const Course = {

  findById: (id, callback) => {
    const query = 'SELECT c.*, ca.Category_name, u.Fullname FROM courses c join users u on u.Id = c.Teacher_id join categories ca on ca.Id = c.Category_id WHERE c.Id = ?';
    db.query(query, [id], (err, results) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, results[0]);
    });
  },

  findAll: (filters, pagination, callback) => {
    const { category, teacher, keyword } = filters;
    const { perPage, offset } = pagination;
    let query = 'SELECT c.*, u.Fullname FROM courses c join users u on u.Id = c.Teacher_id WHERE Status = ?';
    let params = [];
    params.push('Approve')
    if (keyword) {
      query += ' AND (Name_course LIKE ? OR Short_describe LIKE ?)';
      const searchKeyword = `%${keyword}%`;
      params.push(searchKeyword, searchKeyword);
    }
    if (teacher) {
      query += ' AND Teacher_id = ?';
      params.push(teacher);
    }
    if (category) {
      query += ' AND Category_id = ?';
      params.push(category);
    }
    query += ' LIMIT ? OFFSET ?';
    params.push(perPage, offset);

    db.query(query, params, (err, results) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, results);
    });
  },

  countTotal: (filters, callback) => {
    const { category, teacher, keyword } = filters;
    let query = 'SELECT count(*) as Total FROM courses WHERE Status = ?';
    let params = [];
    params.push('Approve')
    if (keyword) {
      query += ' AND (Name_course LIKE ? OR Short_describe LIKE ?)';
      const searchKeyword = `%${keyword}%`;
      params.push(searchKeyword, searchKeyword);
    }
    if (teacher) {
      query += ' AND Teacher_id = ?';
      params.push(teacher);
    }
    if (category) {
      query += ' AND Category_id = ?';
      params.push(category);
    }

    db.query(query, params, (err, results) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, results[0]);
    });
  },

  findCategories: (callback) => {
    const query = 'SELECT * FROM categories WHERE Status = ?';
    db.query(query, ['ON'], (err, results) => {
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

module.exports = Course;
