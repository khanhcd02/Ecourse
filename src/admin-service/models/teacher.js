const db = require('../../../config/db.config');

const Teacher = {
    approveRequestRole: (Req_id, callback) => {
        const query = 'UPDATE teacherrequests SET Request_status = ? where Id = ?';
        db.query(query, ['approved', Req_id], (err, results) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, results[0] );
        });
    },

    rejectRequestRole: (Req_id, callback) => {
        const query = 'UPDATE teacherrequests SET Request_status = ? where Id = ?';
        db.query(query, ['rejected', Req_id], (err, results) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, results[0] );
        });
    },

    checkRequireTeacher: (id, callback) => {
        const query = 'SELECT * FROM doanweb.users WHERE Balance >= 20000 AND Email IS NOT NULL AND Phone_number IS NOT NULL AND Id = ? AND Role = ?';
        db.query(query, [id, 'student'], (err, results) => {
          if (err) {
            return callback(err, null);
          }
          callback(null, results[0]);
        });
      },

    pay: (trans, callback) => {
        const query = 'UPDATE users SET Balance = Balance - ? AND Role = ? WHERE Id = ?';
        db.query(query, [trans.Amount, 'teacher', trans.User_id], (err, results) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, results[0]);
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

    checkRequestRole: (req, callback) => {
        const query = 'SELECT * FROM doanweb.teacherrequests WHERE Request_status = ?';
        db.query(query, ['pending'], (err, results) => {
            if (err) {
            return callback(err, null);
            }
            callback(null, results);
        });
    },
}
module.exports = Teacher;