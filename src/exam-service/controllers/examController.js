const db = require('../../../config/db.config');
const jwt = require('jsonwebtoken');
const ejs = require('ejs');
const fs = require('fs');
const path = require('path');
const Exam = require('../models/exam');
const AnswerSheet = require('../models/answer')

exports.takeExam = (req, res) => {
    const examId = req.params.examId;
    const courseId = req.params.courseId;
    const studentId = req.userId;
    
    // Truy vấn lấy thông tin bài thi và câu hỏi từ database
    Exam.findById(examId, (err, exam) => {
        if (err || !exam) {
            return res.status(404).send('Exam not found');
        }

        Exam.getExam(examId, (err, questions) => {
            if (err) {
                return res.status(500).send('Error fetching questions');
            }
            AnswerSheet.create({ Exam_id: examId, Student_id: studentId, Score: 0 }, (err, answerSheetId) => {
                if (err) {
                    return res.status(500).send('Error creating answer sheet');
                }
    
                // Render trang làm bài thi
                res.render('takeExam', { exam, questions, answerSheetId, Course_id: courseId });
            });
        });
    });
};

exports.submitExam = (req, res) => {
    const examId = req.params.examId;
    const userAnswers = req.body.answers;  // Câu trả lời của học sinh
    const sheetId = req.body.answerSheetId;

    Exam.getExam(examId, (err, questions) => {
        if (err) {
            return res.status(500).send('Error fetching questions');
        }

        let correctCount = 0;

            // Lưu câu trả lời và tính điểm
            questions.forEach((question, index) => {
                const userAnswer = userAnswers[index];
                const isCorrect = (userAnswer === question.Answer);

                // Tăng số câu trả lời đúng
                if (isCorrect) correctCount++;

                // Lưu câu trả lời của học sinh vào `answer_detail`
                AnswerSheet.saveAnswer({
                    Sheet_id: sheetId,
                    Question_id: question.Id,
                    Selected: userAnswer,
                    Is_correct: isCorrect ? 1 : 0
                }, (err, save) => {
                    if (err) {
                        return res.status(500).send('Error updating score');
                    }
                });
            });

            // Cập nhật điểm số vào `answer_sheet`
            const totalQuestions = questions.length;
            const score = (correctCount / totalQuestions) * 100;

            AnswerSheet.update({ Score: score, Id: sheetId}, (err, upAnswerSheet) => {
                if (err) {
                    return res.status(500).send('Error updating score');
                }
                if (score > 70) {
                    const progressExam = {
                        Student_id: req.userId,
                        Course_id: req.body.Course_id,
                        Track_exams: req.body.Track_exams,
                    }
                    Exam.updateProgressExams(progressExam, (err, results) => {
                        if (err) {
                            console.error('Error fetching progressExam:', err);
                            return res.status(500).send('Error fetching progressExam');
                        } else {
                            console.log("cập nhật tiến trình bài tập thành công!")
                        }
                      });
                }
                // Gửi kết quả sau khi nộp bài
                res.render('examResult', { score, correctCount, totalQuestions });
            });
        // Tạo bài làm (answer sheet) trước khi lưu chi tiết câu trả lời
        
    });
};

exports.updateProgressExams = (req, res) => {
    const progressExam = {
      Student_id: req.userId,
      Course_id: req.body.Course_id,
      Track_exams: req.body.Track_exams,
    }
    User.updateProgressExams(progressExam, (err, results) => {
      if (err) {
          console.error('Error fetching progressExam:', err);
          return res.status(500).send('Error fetching progressExam');
      } else {
          console.log("cập nhật tiến trình bài tập thành công!")
      }
    });
  }