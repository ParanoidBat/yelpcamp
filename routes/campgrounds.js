const express = require('express')
const multer = require('multer')

const catchAsync = require('../utils/catchAsync')
const campgroundController = require('../controllers/campgrounds')
const {isLoggedIn, campgroundFormValidate, isAuthor} = require('../middleware')
const {storage} = require('../cloudinary')

const router = express.Router()
const upload = multer({storage})

router.route('/')
    .get(campgroundController.Index)
    .post(isLoggedIn, upload.array('image'), campgroundFormValidate, catchAsync(campgroundController.AddNewCampground))

router.get('/new', isLoggedIn, campgroundController.NewCampgroundForm)

router.route('/:id')
    .get(campgroundController.ShowCampground)
    .put(isLoggedIn, isAuthor, upload.array('image'), campgroundFormValidate, catchAsync( campgroundController.UpdateCampground))
    .delete(isLoggedIn, isAuthor, campgroundController.DeleteCampground)

router.get('/:id/edit', isLoggedIn, isAuthor, campgroundController.EditCampgroundForm)

module.exports = router