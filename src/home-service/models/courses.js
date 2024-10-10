// models/User.js
const db = require('../../../config/db.config');

const Course = {

  findByKeyWord: (id, callback) => {
    const query = 'SELECT * FROM courses WHERE Name_course = ?';
    db.query(query, [id], (err, results) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, results[0]);
    });
  },

  findById: (id, callback) => {
    const query = 'SELECT * FROM courses WHERE Id = ?';
    db.query(query, [id], (err, results) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, results[0]);
    });
  },

  findAll: (callback) => {
    const query = 'SELECT * FROM courses WHERE Status = ?';
    db.query(query, ['Draft'], (err, results) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, results);
    });
  },

}

module.exports = Course;
