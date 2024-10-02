const db = require('../../../config/db.config');

const Answer = {

    create: (newAnswer, callback) => {
        const query = 'INSERT INTO answer_sheet (Exam_id, Student_id, Score) VALUES (?, ?, ?)';
        db.query(query, [newAnswer.Exam_id, newAnswer.Student_id, newAnswer.Score], (err, results) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, results.insertId);
        });
    },

    saveAnswer: (newAnswer, callback) => {
        const query = 'INSERT INTO answer_detail (Sheet_id, Question_id, Selected, Is_correct) VALUES (?, ?, ?, ?)';
        db.query(query, [newAnswer.Sheet_id, newAnswer.Question_id, newAnswer.Selected, newAnswer.Is_correct], (err, results) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, results[0]);
        });
    },

    update: (answer, callback) => {
        const query = 'UPDATE answer_sheet SET Score = ? WHERE Id = ?';
        db.query(query, [answer.Score, answer.Id], (err, results) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, results[0]);
        });
    },

}

module.exports = Answer;