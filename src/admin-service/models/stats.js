const db = require('../../../config/db.config');

const Stats = {

    getReceipts: (x, callback) => {
        const query = 'SELECT * FROM doanweb.transactions WHERE Transaction_type = ?';
        db.query(query, ['deposit'], (err, results) => {
            if (err) {
            return callback(err, null);
            }
            callback(null, results);
        });
    },

    getUsers: (x, callback) => {
        const query = `SELECT 
            SUM(CASE WHEN Role = 'student' THEN 1 ELSE 0 END) AS student_count,
            SUM(CASE WHEN Role = 'teacher' THEN 1 ELSE 0 END) AS teacher_count,
            SUM(CASE WHEN Role = 'admin' THEN 1 ELSE 0 END) AS admin_count
        FROM users;`;
        db.query(query, (err, results) => {
            if (err) {
            return callback(err, null);
            }
            callback(null, results[0]);
        });
    },
}
module.exports = Stats;