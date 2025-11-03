const express = require('express');
const homeController = require('../controllers/homeController');
const router = express.Router();

router.get('/', homeController.home);


router.use('/users', require('./users'));
router.use('/medicines', require('./medicines'));

module.exports = router;

