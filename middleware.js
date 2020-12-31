const Campground = require('./models/campground')
const Review = require('./models/review')
const {campgroundSchema, reviewSchema} = require('./schemas')
const ExpressError = require('./utils/ExpressError')

module.exports.isLoggedIn = (req, res, next) =>{
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl
        
        req.flash('error', 'Must be logged in')
        res.redirect('/login')
    }
    else{
        next()
    }
}

module.exports.campgroundFormValidate = (req, res, next) =>{
    const {error} = campgroundSchema.validate(req.body)
    
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }
    else{
        next()
    }
}

module.exports.isAuthor = async(req, res, next) =>{
    const {id} = req.params
    const camp = await Campground.findById(id)

    if(!camp.author.equals(req.user._id)){
        req.flash('error', 'Not Authorized')
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
}

module.exports.reviewFormValidate = (req, res, next) =>{
    const {error} = reviewSchema.validate(req.body)

    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }
    else{
        next()
    }
}

module.exports.isReviewAuthor = async(req, res, next) =>{
    const {id, reviewId} = req.params
    const review = await Review.findById(reviewId)

    if(!review.author.equals(req.user._id)){
        req.flash('error', 'Not Authorized')
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
}