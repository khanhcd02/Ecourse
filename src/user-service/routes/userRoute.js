const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyToken = require('../../middleware/checkToken');
const jwt = require('jsonwebtoken');
const path = require('path');
const multer = require('multer');

const storageCertification = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './static/img/certification/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); 
    }
});

const storageProfile = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './static/img/users/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); 
    }
});

const uploadCertification = multer({ storage: storageCertification });
const uploadProfile = multer({ storage: storageProfile });
router.get('/', verifyToken, userController.profile);
router.get('/qrcode', verifyToken, userController.qrcode);
router.post('/qrcode', verifyToken, userController.transfer);
router.get('/success-page', verifyToken, userController.success);
router.post('/join', verifyToken, userController.joinCourses);
router.post('/progress/lessons', verifyToken, userController.updateProgressLessons);
router.get('/learning/:courseId', verifyToken, userController.Learning);
router.post('/learning/lesson', verifyToken, userController.startLesson);
router.get('/check/trans', verifyToken, userController.checkTrans);
router.get('/reqTeacher', verifyToken, userController.checkRequestTeacher);
router.post('/reqTeacher', verifyToken, uploadCertification.single('Certification'), userController.requestTeacherRole);

module.exports = router;
