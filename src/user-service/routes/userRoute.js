const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyToken = require('../../middleware/checkToken');
const jwt = require('jsonwebtoken');
router.get('/', verifyToken, userController.profile);

module.exports = router;
