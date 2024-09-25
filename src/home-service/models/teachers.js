// models/User.js
const db = require('../../../config/db.config');

const Teacher = {

  findById: (id, callback) => {
    const query = 'SELECT * FROM users WHERE id = ?';
    db.query(query, [id], (err, results) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, results[0]);
    });
  },

  findAll: (callback) => {
    const query = 'SELECT * FROM users WHERE Role = ?';
    db.query(query, ['teacher'], (err, results) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, results);
    });
  },

  findOne: (username, callback) => {
    const query = 'SELECT * FROM users WHERE Username = ?';
    db.query(query, [username], (err, results) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, results[0]);
    });
  },

}

module.exports = Teacher;
