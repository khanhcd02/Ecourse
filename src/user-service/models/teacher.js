const db = require('../../../config/db.config');

const Teacher = {
    requestRole: (request, callback) => {
        const query = 'INSERT INTO teacherrequests(User_id,Certification,Expertise,Request_status) VALUES (?, ?, ?, ?)';
        db.query(query, [request.User_id, request.Certification, request.Expertise, 'pending'], (err, results) => {
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

    checkRequestResult: (user, callback) => {
        const query = 'SELECT * FROM doanweb.teacherrequests WHERE User_id = ?';
        db.query(query, [user.id], (err, results) => {
            if (err) {
            return callback(err, null);
            }
            callback(null, results);
        });
    },
}
module.exports = Teacher;