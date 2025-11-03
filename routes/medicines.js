const express = require('express');
const passport = require('passport');
const medicineController = require('../controllers/medicineController');
const router = express.Router();

router.get('/', passport.authenticate('jwt', {session: false}), medicineController.getall);
router.post('/create', passport.authenticate('jwt', {session: false}), medicineController.create);
router.delete('/:id', passport.authenticate('jwt', {session: false, failureRedirect: '/users/user-not-found'}), medicineController.detele)

module.exports = router;