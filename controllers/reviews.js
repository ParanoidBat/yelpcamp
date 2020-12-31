const Campground = require('../models/campground')
const Review = require('../models/review')

module.exports.AddReview = async(req, res)=>{
    const camp = await Campground.findById(req.params.id)

    if(!camp){
        req.flash('error', 'Campground doesn\'t exist')
        return res.redirect('/campgrounds')
    }

    const review = new Review(req.body)
    review.author = req.user._id
    camp.reviews.push(review)

    await review.save()
    await camp.save()

    req.flash('success', 'Your review has been added')
    res.redirect(`/campgrounds/${camp._id}`)
}

module.exports.DelteReview = async(req, res)=>{
    const {id, reviewId} = req.params
    
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId)

    req.flash('success', 'Your review has been deleted')
    res.redirect(`/campgrounds/${id}`)
}