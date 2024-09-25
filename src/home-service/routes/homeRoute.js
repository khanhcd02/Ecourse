const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
const verifyLogin = require('../../middleware/checkLogin');
const jwt = require('jsonwebtoken');
router.get('/', verifyLogin, homeController.home);
router.get('/teachers', verifyLogin, homeController.teachers);

module.exports = router;
