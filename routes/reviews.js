const express = require('express')

const catchAsync = require('../utils/catchAsync')
const reviewController = require('../controllers/reviews')
const {reviewFormValidate, isLoggedIn, isReviewAuthor} = require('../middleware')

const router = express.Router({mergeParams: true})

router.post('/', isLoggedIn, reviewFormValidate, catchAsync(reviewController.AddReview))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviewController.DelteReview))

module.exports = router