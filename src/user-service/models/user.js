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

  findOne: (username, callback) => {
    const query = 'SELECT * FROM users WHERE Username = ?';
    db.query(query, [username], (err, results) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, results[0]);
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

}

module.exports = User;
