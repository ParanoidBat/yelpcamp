const express = require('express')
const passport = require('passport')

const userController = require('../controllers/users')
// const catchAsync = require('../utils/catchAsync')

const router = express.Router()

router.route('/register')
    .get(userController.RegisterUserForm)
    .post(userController.RegisterUser)

router.route('/login')
    .get(userController.LoginForm)
    .post(passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), userController.LoginUser)

router.get('/logout', userController.Logout)

module.exports = router