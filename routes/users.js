const express = require('express');
const router = express.Router();
const passport = require('passport');

const userController = require('../controllers/userController');

router.post('/create', userController.create);

router.post('/login', passport.authenticate('local', {session: false /* not using session */}), userController.createSession)
router.get('/profile', passport.authenticate('jwt', {
    session: false,
    failureRedirect: '/users/user-not-found'
}), userController.profile);

router.get('/user-not-found', userController.userNotFound);

module.exports = router;

