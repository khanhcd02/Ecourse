const db = require('../../../config/db.config');

const Category = {
    addCategory: (Category_name, callback) => {
        const query = 'INSERT INTO categories(Category_name,Status) VALUES (?, ?)';
        db.query(query, [Category_name, 'ON'], (err, results) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, results[0] );
        });
    },

    updateCategory: (c, callback) => {
        const query = 'UPDATE categories SET Category_name = ? where Id = ?';
        db.query(query, [c.Category_name, c.Id], (err, results) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, results[0] );
        });
    },

    updateStatus: (c, callback) => {
        const query = 'UPDATE categories SET Status = ? where Id = ?';
        db.query(query, [c.Status, c.Id], (err, results) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, results[0] );
        });
    },

    getCategories: (callback) => {
        const query = 'SELECT * FROM doanweb.categories;';
        db.query(query, (err, results) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, results );
        });
    },
}
module.exports = Category;