// models/User.js
const db = require('../../config/db.config');

const Category = {

  findALL: (x, callback) => {
    const query = 'SELECT * FROM categories WHERE Status = ?';
    db.query(query, ['ON'], (err, results) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, results);
    });
  },

}

module.exports = Category;
