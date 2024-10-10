const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyToken = require('../../middleware/checkToken');
const jwt = require('jsonwebtoken');
router.get('/', verifyToken, userController.profile);
router.get('/qrcode', verifyToken, userController.qrcode);
router.post('/qrcode', verifyToken, userController.transfer);
router.get('/success-page', verifyToken, userController.success);
router.post('/join', verifyToken, userController.joinCourses);
router.post('/progress/lessons', verifyToken, userController.updateProgressLessons);

module.exports = router;
